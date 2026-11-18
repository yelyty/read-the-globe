import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  PushPinIcon,
} from '@phosphor-icons/react';

import AtlasMap, { type Show } from '../../components/AtlasMap/AtlasMap';
import { useAuth } from '../../auth/auth-context';
import { useCountryNames } from '../../hooks/useCountryNames';
import { useLanding } from '../../hooks/useLanding';
import { useBooks, useWorlds } from '../../hooks/useReader';
import PageTitle from '../../components/PageTitle/PageTitle';
import ButtonLink from '../../components/Button/ButtonLink';
import { byLogged } from '../../utils/readDate';
import { firstName } from '../../utils/firstName';
import { m } from '../../paraglide/messages.js';
import * as styles from './HomePage.css';
import AtlasCountries from './features/AtlasCountries/AtlasCountries';
import BeyondMap from './features/BeyondMap/BeyondMap';
import Cartouche from './features/Cartouche';
import MapKey from './components/MapKey';
import MapTip from './components/MapTip';
import RecentReads from './features/RecentReads';
import { useAtlasView } from './hooks/useAtlasView';
import { useFullScreen } from './hooks/useFullScreen';
import { useMapTip } from './hooks/useMapTip';
import { usePinFlight } from './hooks/usePinFlight';
import { usePlateInput } from './hooks/usePlateInput';

const RECENT = 3;

/**
 * Shows the Home page: the atlas map, its key and numbers, the countries by continent, the imagined worlds, and the recent reads.
 * After a book is pinned, the map shows the atlas as it was, and each country takes its mark when its pin lands.
 */
const HomePage = () => {
  const [show, setShow] = useState<Show>('all');
  const [full, setFull] = useFullScreen();
  const { tip, setTip, tipAt, focusCountry } = useMapTip();
  const plate = useRef<HTMLDivElement>(null);

  const books = useBooks();
  const savedWorlds = useWorlds();
  const { user } = useAuth();
  const names = useCountryNames();
  const [landing, setLanding] = useLanding();

  /* A book just pinned: until its pins land, Home draws the atlas as it was (map, count, rows), and each country
     takes its mark as its pin arrives. ponytail: leaving Home mid-flight keeps the landing, so it flies again
     on the next visit; clear it on unmount if that ever matters. */
  const flying =
    landing && books.some((book) => book.id === landing.bookId)
      ? landing
      : null;

  const clearLanding = useCallback(() => setLanding(null), [setLanding]);
  const { landed, said, tick } = usePinFlight(plate, flying, clearLanding);

  const {
    marks,
    shown,
    held,
    painted,
    dots,
    worlds,
    stats,
    imagined,
    caption,
    blank,
  } = useAtlasView(books, savedWorlds, flying, landed);

  const {
    handlePlatePointerDown,
    handlePlateMouseMove,
    handlePlateMouseLeave,
    handlePlateClick,
    handleFullToggle,
  } = usePlateInput({ marks, full, setFull, tip, setTip, tipAt });

  const first = firstName(user?.signUpName);

  const title = blank
    ? m.home_blank()
    : first
      ? m.home_named_atlas({ name: first })
      : m.home_your_atlas();

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
