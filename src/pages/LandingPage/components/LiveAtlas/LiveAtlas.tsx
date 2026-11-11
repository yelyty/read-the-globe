import { useEffect, useMemo, useRef, useState } from 'react';
import type { Feature } from 'geojson';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { mainPiece, worldShapes } from '../../../../utils/worldShapes';
import { toNumeric } from '../../../../utils/toIsoNumeric';
import { atlasAfter, BOOKS } from './miraAtlas';
import { srOnly } from '../../../../styles/global.css';
import * as styles from './LiveAtlas.css';
import { m } from '../../../../paraglide/messages.js';

// the app's own flat map (AtlasMap): 360° across, 83°N to 57°S down, no Antarctica
const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (83 + 57)) / 360);

const projection = geoEquirectangular()
  .scale(WIDTH / (2 * Math.PI))
  .center([0, (83 - 57) / 2])
  .translate([WIDTH / 2, HEIGHT / 2]);

const path = geoPath(projection);
const ANTARCTICA = '010';

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Ping = { key: string; x: number; y: number };

// Mira's 48 books pin themselves, oldest first, as the map rises through the screen; scrolling back unpins them.
// The map itself zooms in and lies flat as it rises. Reduced motion: the finished map, still.
const LiveAtlas = () => {
  const figure = useRef<HTMLElement>(null);
  const [shapes, setShapes] = useState<Record<string, Feature>>();

  // how many books are pinned, and whether the last scroll added one (only then do rings ping)
  const [{ shown, grew }, setPinned] = useState(() => ({
    shown: reduced() ? BOOKS.length : 0,
    grew: false,
  }));

  // the world's shapes are big: fetch them only once the map is a screen away
  useEffect(() => {
    const el = figure.current;

    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void worldShapes().then(setShapes);
      },
      { rootMargin: '100% 0px' }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = figure.current;

    if (!el || reduced()) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;

      // the window: 80% and tilted back as it enters, full size and flat once its top nears the top of the screen
      const progress = Math.min(
        1,
        Math.max(0, (innerHeight - top) / (innerHeight * 0.85))
      );

      el.style.setProperty('--z', (0.8 + 0.2 * progress).toFixed(4));
      el.style.setProperty('--tilt', `${(18 * (1 - progress)).toFixed(2)}deg`);
      // the books: none at the top of the page, all of them once the window's top is near the top of the screen
      const end = Math.max(1, top + scrollY - innerHeight * 0.12);

      const next = Math.round(
        Math.min(1, Math.max(0, scrollY / end)) * BOOKS.length
      );

      setPinned((prev) =>
        prev.shown === next ? prev : { shown: next, grew: next > prev.shown }
      );
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();

    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const countries = useMemo(
    () =>
      shapes
        ? Object.entries(shapes)
            .filter(([code]) => code !== ANTARCTICA)
            .map(([code, shape]) => ({ code, d: path(shape) ?? '' }))
        : [],
    [shapes]
  );

  // a ring lands on each country the newest book marks, on its biggest piece (the US ping is in the lower 48)
  const pings: Ping[] =
    grew && shapes
      ? [...new Set([BOOKS[shown - 1][2], ...BOOKS[shown - 1][3]])].flatMap(
          (iso) => {
            const shape = shapes[toNumeric(iso) ?? ''];

            if (!shape) return [];
            const [centerX, centerY] = path.centroid(mainPiece(shape));

            return [{ key: `${shown}-${iso}`, x: centerX, y: centerY }];
          }
        )
      : [];

  const atlas = atlasAfter(shown);
  const latest = BOOKS[shown - 1];

  const now = !latest
    ? m.landing_atlas_scroll()
    : shown === BOOKS.length && reduced()
      ? `${m.count_book({ count: BOOKS.length })}, ${m.count_country({ count: atlas.countries })}`
      : m.landing_atlas_latest({ title: latest[0], author: latest[1] });

  return (
    <figure className={styles.frame} id="atlas" ref={figure}>
      <div className={styles.sheet}>
        <div className={styles.head}>
          <span className={styles.title}>{m.landing_atlas_title()}</span>
          <span className={styles.tag}>{m.landing_atlas_tag()}</span>
        </div>
        <svg
          className={styles.map}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby="al-desc"
          focusable="false"
        >
          <defs>
            <pattern
              id="al-hatch"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="3" height="6" className={styles.hatchSet} />
              <rect x="3" width="3" height="6" className={styles.hatchAuthor} />
            </pattern>
          </defs>
          <g>
            {countries.map(({ code, d }) => {
              const set = atlas.set.has(code);
              const author = atlas.author.has(code);

              return (
                <path
                  key={code}
                  d={d}
                  className={
                    set && author
                      ? styles.both
                      : set
                        ? styles.set
                        : author
                          ? styles.author
                          : styles.land
                  }
                />
              );
            })}
          </g>
          <g>
            {pings.map((ping) => (
              <circle
                key={ping.key}
                className={styles.ping}
                cx={ping.x}
                cy={ping.y}
                r={14}
              />
            ))}
          </g>
        </svg>
        <p className={srOnly} id="al-desc">
          {m.landing_atlas_desc()}
        </p>
        <div className={styles.foot} aria-hidden="true">
          <p className={styles.count}>
            <b>{atlas.countries}</b>
            <span>/ 195</span>
            <em>{m.landing_atlas_countries()}</em>
          </p>
          <p className={styles.now}>{now}</p>
          <p className={styles.books}>
            <b>{shown}</b> {m.landing_atlas_of_books({ total: BOOKS.length })}
          </p>
        </div>
        <ul className={styles.key} aria-hidden="true">
          <li>
            <i className={styles.keySet} />
            {m.landing_key_set()}
          </li>
          <li>
            <i className={styles.keyAuthor} />
            {m.landing_key_author()}
          </li>
          <li>
            <i className={styles.keyBoth} />
            {m.landing_key_both()}
          </li>
        </ul>
      </div>
    </figure>
  );
};

export default LiveAtlas;
