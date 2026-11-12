import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  FlagIcon,
  PushPinIcon,
} from '@phosphor-icons/react';
import AtlasMap, {
  ANTARCTICA,
  type Show,
} from '../../components/AtlasMap/AtlasMap.tsx';
import { atlasMarks, atlasStats } from '../../utils/atlasMarks';
import { worldsOf } from '../../utils/worlds';

import * as styles from './HomePage.css';
import { useAuth } from '../../auth/auth-context.ts';
import { useCountryNames } from '../../hooks/useCountryNames.ts';
import { useLanding } from '../../hooks/useLanding.ts';
import { useStatus } from '../../hooks/useStatus.ts';
import AtlasCountries from './AtlasCountries.tsx';
import BeyondMap from './BeyondMap.tsx';
import Cartouche from './features/Cartouche.tsx';
import MapKey from './MapKey.tsx';
import MapTip, { type Tip } from './MapTip.tsx';
import RecentReads from './features/RecentReads.tsx';
import PageTitle from '../../components/PageTitle/PageTitle.tsx';
import { byLogged } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';

const app = getRouteApi('/app');
const RECENT = 3;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const PIN =
  '<svg viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.8"/></svg>';

// a country too small to see fill gets a gold ring where the pin landed
const ringAt = (rect: DOMRect) => {
  const ring = document.createElement('div');

  ring.className = styles.landRing;
  ring.setAttribute('aria-hidden', 'true');
  ring.style.left = `${rect.left + rect.width / 2}px`;
  ring.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(ring);

  ring.animate(
    [
      { transform: 'translate(-50%, -50%) scale(.4)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(1.7)', opacity: 0 },
    ],
    { duration: 750, easing: 'cubic-bezier(.2,.8,.25,1)' }
  ).onfinish = () => ring.remove();
};

// Home, with the plate in view: scroll only if it isn't already, and let the scroll settle before anything flies
const plateInView = (plate: Element) =>
  new Promise<void>((done) => {
    const top = plate.getBoundingClientRect().top;
    const head = document.querySelector('header')?.offsetHeight ?? 0;

    if (top >= head - 4 && top < innerHeight * 0.35)
      return requestAnimationFrame(() => done());
    const to = Math.max(0, top + scrollY - head - 24);

    if (reduced()) {
      scrollTo({ top: to, behavior: 'instant' });

      return requestAnimationFrame(() => done());
    }

    addEventListener('scrollend', () => done(), { once: true });
    setTimeout(done, 650);
    scrollTo({ top: to, behavior: 'smooth' });
  });

// the map's countries are drawn once its shapes arrive: wait for them (two seconds at most)
const drawn = (plate: Element) =>
  new Promise<void>((done) => {
    let tries = 0;

    const look = () =>
      plate.querySelector('[data-code]') || ++tries > 120
        ? done()
        : requestAnimationFrame(look);

    look();
  });

const HomePage = () => {
  const [show, setShow] = useState<Show>('all');
  const [full, setFull] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const [landed, setLanded] = useState<Set<string>>(() => new Set());
  const [said, setSaid] = useState('');
  const [tick, setTick] = useState(0);
  const pointer = useRef<'mouse' | 'touch'>('mouse');
  const plate = useRef<HTMLDivElement>(null);

  const { books, worlds: savedWorlds } = app.useLoaderData();
  const { user } = useAuth();
  const names = useCountryNames();
  const [landing, setLanding] = useLanding();
  const { show: say } = useStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!full) return;

    const close = (keyEvent: KeyboardEvent) =>
      keyEvent.key === 'Escape' && setFull(false);

    document.addEventListener('keydown', close);
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', close);
      document.documentElement.style.overflow = '';
    };
  }, [full]);

  // a tip goes on Escape, or a press anywhere but the map and the country list
  useEffect(() => {
    if (!tip) return;

    const away = (dismissEvent: Event) =>
      (dismissEvent instanceof KeyboardEvent
        ? dismissEvent.key === 'Escape'
        : !(dismissEvent.target as Element).closest('[data-tips]')) &&
      setTip(null);

    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', away);

    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', away);
    };
  }, [tip]);

  // the line said when the pins land stays a few seconds
  useEffect(() => {
    if (!said) return;
    const timer = setTimeout(() => setSaid(''), 6000);

    return () => clearTimeout(timer);
  }, [said]);

  /* A book just pinned: until its pins land, Home draws the atlas as it was (map, count, rows), and each country
     takes its mark as its pin arrives. ponytail: leaving Home mid-flight keeps the landing, so it flies again
     on the next visit; clear it on unmount if that ever matters. */
  const flying =
    landing && books.some((book) => book.id === landing.bookId)
      ? landing
      : null;

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

  /* The one authored moment: an ink pin with a gold head leaves Log a book, arcs to each country the book adds,
     and the country takes its mark as the pin lands. The count, the line and the goal news wait for the last
     pin. Reduced motion lands everything at once. */
  useEffect(() => {
    const box = plate.current;

    if (!flying || !box) return;
    let live = true;
    const pins: HTMLElement[] = [];

    const land = () => {
      if (!live) return;
      setLanded(new Set(flying.targets));
      setLanding(null);
      setTick((prev) => prev + 1);
      setSaid(flying.line);
      // the bigger news, a beat after the pin: a goal crossed its flag with this book
      const reached = flying.reached;

      if (reached)
        setTimeout(
          () =>
            say({
              text: reached,
              action: {
                label: m.home_see_it(),
                icon: <FlagIcon aria-hidden="true" />,
                run: () => navigate({ to: '/app/goals' }),
              },
            }),
          reduced() ? 0 : 900
        );
    };

    (async () => {
      setLanded(new Set());
      await drawn(box);
      await plateInView(box);
      if (!live) return;

      const paths = flying.targets
        .map((code) =>
          box.querySelector<SVGPathElement>(`[data-code="${code}"]`)
        )
        .filter((path): path is SVGPathElement => !!path);

      if (reduced() || !paths.length) return land();
      // phones: bring the first country into view before anything lands on it
      const scroller = paths[0].ownerSVGElement?.parentElement;

      if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
        const scrollerRect = scroller.getBoundingClientRect();
        const targetRect = paths[0].getBoundingClientRect();

        scroller.scrollLeft +=
          targetRect.left +
          targetRect.width / 2 -
          (scrollerRect.left + scrollerRect.width / 2);

        await new Promise(requestAnimationFrame);
      }

      // a return visit: no flight to a country already marked, just a ring where the book went back to
      if (flying.returning) {
        ringAt(paths[0].getBoundingClientRect());

        return land();
      }

      const launch =
        [...document.querySelectorAll('[data-log-toggle]')].find(
          (toggle) =>
            toggle.getClientRects().length &&
            getComputedStyle(toggle).visibility !== 'hidden'
        ) ?? document.querySelector('header');

      const from = launch!.getBoundingClientRect();
      const x0 = from.left + from.width / 2;
      const y0 = from.top + from.height / 2;
      let count = 0;

      paths.forEach((path, index) => {
        const rect = path.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - x0;
        const dy = rect.top + rect.height / 2 - y0;
        const lift = Math.min(160, Math.abs(dx) * 0.25 + 60);
        const pin = document.createElement('div');

        pin.className = styles.flyPin;
        pin.setAttribute('aria-hidden', 'true');
        pin.innerHTML = PIN;
        pin.style.left = `${x0}px`;
        pin.style.top = `${y0}px`;
        document.body.appendChild(pin);
        pins.push(pin);

        pin.animate(
          [
            { transform: 'translate(-50%, -100%) scale(1.2)', opacity: 0 },
            {
              transform: 'translate(-50%, -100%) scale(1)',
              opacity: 1,
              offset: 0.12,
            },
            {
              transform: `translate(calc(-50% + ${dx / 2}px), calc(-100% + ${dy / 2 - lift}px)) scale(1)`,
              offset: 0.55,
            },
            {
              transform: `translate(calc(-50% + ${dx}px), calc(-100% + ${dy}px)) scale(1)`,
              opacity: 1,
              offset: 0.9,
            },
            {
              transform: `translate(calc(-50% + ${dx}px), calc(-100% + ${dy}px)) scale(.6)`,
              opacity: 0,
            },
          ],
          {
            duration: 820,
            delay: 120 + index * 110,
            easing: 'cubic-bezier(.45,.05,.3,1)',
            fill: 'forwards',
          }
        ).onfinish = () => {
          pin.remove();
          if (!live) return;
          const code = path.dataset.code!;

          setLanded((prev) => new Set(prev).add(code));
          if (rect.width < 24 && rect.height < 24) ringAt(rect);
          if (++count === paths.length) setTimeout(land, 260);
        };
      });
    })();

    return () => {
      live = false;
      pins.forEach((pin) => pin.remove());
    };
  }, [flying, setLanding, say, navigate]);

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

  const tipAt = useCallback((code: string, el: Element, by: Tip['by']) => {
    const rect = el.getBoundingClientRect();

    setTip({
      code,
      x: rect.left + rect.width / 2,
      y: rect.top,
      bottom: rect.bottom,
      by,
    });
  }, []);

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
            onFocusCountry={(code, el) =>
              el ? tipAt(code, el, 'key') : setTip(null)
            }
          />
        </>
      ),
    [blank, worlds, shown, names, held, tipAt]
  );

  return (
    <>
      <PageTitle>{title}</PageTitle>

      {blank && (
        <div className={styles.firstRun}>
          <p>{m.home_first_run()}</p>
          <Link
            className={styles.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            {m.home_log_first()}
          </Link>
        </div>
      )}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- mouse shortcuts; the country list and the full screen button are the keyboard way */}
      <div
        ref={plate}
        className={styles.plate}
        data-full={full || undefined}
        data-tips
        onPointerDown={(pointerEvent) => {
          pointer.current =
            pointerEvent.pointerType === 'touch' ||
            pointerEvent.pointerType === 'pen'
              ? 'touch'
              : 'mouse';
        }}
        onMouseMove={(mouseEvent) => {
          if (pointer.current === 'touch') return;
          const at = codeAt(mouseEvent.target);

          setTip(
            at
              ? {
                  code: at.code,
                  x: mouseEvent.clientX,
                  y: mouseEvent.clientY,
                  bottom: mouseEvent.clientY,
                  by: 'mouse',
                }
              : null
          );
        }}
        onMouseLeave={() => pointer.current !== 'touch' && setTip(null)}
        onClick={(clickEvent) => {
          const at = codeAt(clickEvent.target);

          if (!at) {
            setTip(null);
            // anywhere but a country opens the full screen map
            if (
              !full &&
              (clickEvent.target as Element).closest('.rsm-svg') &&
              !(clickEvent.target as Element).closest('[data-code]')
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
        }}
      >
        <button
          type="button"
          className={styles.fullBtn}
          aria-pressed={full}
          aria-label={
            full ? m.home_full_close_label() : m.home_full_open_label()
          }
          title={full ? m.home_full_close() : m.home_full_open()}
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            setFull(!full);
          }}
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
