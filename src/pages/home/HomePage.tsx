import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  PushPinIcon,
} from '@phosphor-icons/react';

import AtlasMap, {
  ANTARCTICA,
  type Show,
} from '../../components/AtlasMap/AtlasMap';
import { atlasMarks, atlasStats } from '../../utils/atlasMarks';
import { worldsOf } from '../../utils/worlds';
import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { useLanding } from '../../hooks/useLanding';
import PageTitle from '../../components/PageTitle/PageTitle';
import ButtonLink from '../../components/Button/ButtonLink';
import { byLogged } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import * as styles from './HomePage.css';
import AtlasCountries from './AtlasCountries';
import BeyondMap from './BeyondMap';
import Cartouche from './features/Cartouche';
import MapKey from './MapKey';
import MapTip from './MapTip';
import RecentReads from './features/RecentReads';
import { useFullScreen } from './useFullScreen';
import { useMapTip } from './useMapTip';
import { usePinFlight } from './usePinFlight';

const app = getRouteApi('/app');
const RECENT = 3;

const HomePage = () => {
  const [show, setShow] = useState<Show>('all');
  const [full, setFull] = useFullScreen();
  const { tip, setTip, tipAt, focusCountry } = useMapTip();
  const pointer = useRef<'mouse' | 'touch'>('mouse');
  const plate = useRef<HTMLDivElement>(null);

  const { books, worlds: savedWorlds } = app.useLoaderData();
  const { user } = useAuth();
  const names = useCountryNames();
  const [landing, setLanding] = useLanding();
  const navigate = useNavigate();

  /* A book just pinned: until its pins land, Home draws the atlas as it was (map, count, rows), and each country
     takes its mark as its pin arrives. ponytail: leaving Home mid-flight keeps the landing, so it flies again
     on the next visit; clear it on unmount if that ever matters. */
  const flying =
    landing && books.some((book) => book.id === landing.bookId)
      ? landing
      : null;

  const clearLanding = useCallback(() => setLanding(null), [setLanding]);
  const { landed, said, tick } = usePinFlight(plate, flying, clearLanding);

  const marks = useMemo(() => atlasMarks(books), [books]);

  const shown = useMemo(
    () => (flying ? books.filter((book) => book.id !== flying.bookId) : books),
    [books, flying]
  );

  const held = useMemo(
    () => (flying ? atlasMarks(shown) : marks),
    [flying, shown, marks]
  );

  const painted = useMemo(
    () =>
      flying
        ? {
            ...held,
            ...Object.fromEntries(
              [...landed]
                .filter((code) => marks[code])
                .map((code) => [code, marks[code]])
            ),
          }
        : marks,
    [flying, held, landed, marks]
  );

  const dots = useMemo(
    () =>
      shown
        .flatMap((book) => book.places ?? [])
        .filter((place) => place.lon != null && place.lat != null),
    [shown]
  );

  const worlds = useMemo(
    () => worldsOf(shown, savedWorlds),
    [shown, savedWorlds]
  );

  const stats = useMemo(() => atlasStats(shown, held), [shown, held]);

  const firstName = String(user?.signUpName ?? '')
    .trim()
    .split(/\s+/)[0];

  const blank = !shown.length;

  const title = blank
    ? m.home_blank()
    : firstName
      ? m.home_named_atlas({ name: firstName })
      : m.home_your_atlas();

  // the countries a tip and a click are for: every marked one, and every unmarked one but Antarctica.
  // ponytail: the mock offers only the 195; here Taiwan or Kosovo invite a book too, as the form already lists them
  const codeAt = (target: EventTarget) => {
    const el = (target as Element).closest<SVGElement>('[data-code]');
    const code = el?.dataset.code;

    return el && code && code !== ANTARCTICA ? { el, code } : null;
  };

  const imagined = worlds.filter((world) => world.books.length).length;

  // laid over the map; kept as one element so the map itself doesn't redraw while a tip follows the pointer
  const overlay = useMemo(
    () => (
      <>
        {!blank && (
          <Cartouche stats={stats} show={show} worlds={imagined} tick={tick} />
        )}
        <p className={styles.atlasStatus} role="status" hidden={!said}>
          {said}
        </p>
      </>
    ),
    [blank, stats, show, imagined, tick, said]
  );

  const caption = stats.countries
    ? m.home_map_caption({
        countries: stats.countries,
        set: stats.set,
        authors: stats.authors,
      })
    : m.home_map_caption_empty();

  // the rows under the map, kept as one element so they don't re-render while a tip follows the pointer
  const below = useMemo(
    () =>
      !blank && (
        <>
          <BeyondMap worlds={worlds} />
          <RecentReads
            books={[...shown].sort(byLogged).slice(0, RECENT)}
            names={names}
          />
          <AtlasCountries
            marks={held}
            names={names}
            onFocusCountry={focusCountry}
          />
        </>
      ),
    [blank, worlds, shown, names, held, focusCountry]
  );

  /* ---------- the plate's mouse shortcuts ---------- */
  // a pen counts as touch: no hover tips, and a tap shows the card first
  const handlePlatePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointer.current =
      event.pointerType === 'touch' || event.pointerType === 'pen'
        ? 'touch'
        : 'mouse';
  };

  const handlePlateMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (pointer.current === 'touch') return;
    const at = codeAt(event.target);

    setTip(
      at
        ? {
            code: at.code,
            x: event.clientX,
            y: event.clientY,
            bottom: event.clientY,
            by: 'mouse',
          }
        : null
    );
  };

  const handlePlateMouseLeave = () => {
    if (pointer.current !== 'touch') setTip(null);
  };

  const handlePlateClick = (event: MouseEvent<HTMLDivElement>) => {
    const at = codeAt(event.target);

    if (!at) {
      setTip(null);
      // anywhere but a country opens the full screen map
      if (
        !full &&
        (event.target as Element).closest('.rsm-svg') &&
        !(event.target as Element).closest('[data-code]')
      )
        setFull(true);

      return;
    }

    // on touch, a tap shows the country's card first; a second tap on the same country acts
    if (pointer.current === 'touch' && tip?.code !== at.code)
      return tipAt(at.code, at.el, 'touch');
    setTip(null);
    if (marks[at.code])
      return navigate({
        to: '/app/shelf',
        search: { country: at.code },
      });
    // an unmarked country opens Log a book with it as a place
    setFull(false);

    navigate({
      to: '.',
      search: (prev) => ({ ...prev, log: true, country: at.code }),
    });
  };

  // the button sits on the plate: its click mustn't reach the plate's own
  const handleFullToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFull(!full);
  };

  return (
    <>
      <PageTitle>{title}</PageTitle>

      {blank && (
        <div className={styles.firstRun}>
          <p>{m.home_first_run()}</p>
          <ButtonLink
            variant="primary"
            className={styles.cta}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            {m.home_log_first()}
          </ButtonLink>
        </div>
      )}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- mouse shortcuts; the country list and the full screen button are the keyboard way */}
      <div
        ref={plate}
        className={styles.plate}
        data-full={full || undefined}
        data-tips
        onPointerDown={handlePlatePointerDown}
        onMouseMove={handlePlateMouseMove}
        onMouseLeave={handlePlateMouseLeave}
        onClick={handlePlateClick}
      >
        <button
          type="button"
          className={styles.fullBtn}
          aria-pressed={full}
          aria-label={
            full ? m.home_full_close_label() : m.home_full_open_label()
          }
          title={full ? m.home_full_close() : m.home_full_open()}
          onClick={handleFullToggle}
        >
          {full ? (
            <ArrowsInIcon aria-hidden="true" />
          ) : (
            <ArrowsOutIcon aria-hidden="true" />
          )}
        </button>
        <AtlasMap
          marks={painted}
          dots={dots}
          show={show}
          open
          landed={landed}
          caption={caption}
        >
          {overlay}
        </AtlasMap>
        {!blank && (
          <MapKey show={show} onShow={setShow} canFilter={shown.length > 1} />
        )}
      </div>

      {below}

      {tip && <MapTip tip={tip} marks={marks} names={names} />}
    </>
  );
};

export default HomePage;
