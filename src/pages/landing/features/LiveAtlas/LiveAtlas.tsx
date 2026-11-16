import { useEffect, useMemo, useRef, useState } from 'react';
import { geoPath } from 'd3-geo';

import { mainPiece } from '../../../../utils/world';
import { useWorldShapes } from '../../../../hooks/useWorldShapes';
import { toNumeric } from '../../../../utils/toIsoNumeric';
import { srOnly } from '../../../../styles/global.css';
import {
  flatProjection,
  MAP_HEIGHT as HEIGHT,
  MAP_WIDTH as WIDTH,
} from '../../../../utils/flatMap';
import { prefersReducedMotion } from '../../../../utils/motion';
import { m } from '../../../../paraglide/messages.js';
import HatchPattern from '../../../../components/HatchPattern/HatchPattern';
import { HATCH_STAMP } from '../../../../components/HatchPattern/hatchSize';
import { atlasAfter, BOOKS } from './miraAtlas';
import AtlasCountry from './AtlasCountry';
import AtlasPing from './AtlasPing';
import * as styles from './LiveAtlas.css';

// the window grows to full size over this share of the screen's height as it scrolls in
const GROW_SPAN = 0.85;
// it starts at 80% of its size and tilted back 18°
const START_ZOOM = 0.8;
const START_TILT_DEG = 18;
// all the books are pinned once the window's top is this share of the screen from the top
const PINNED_AT = 0.12;
// digits the CSS variables are written with
const ZOOM_DIGITS = 4;
const TILT_DIGITS = 2;

// the app's own flat map (AtlasMap)
const projection = flatProjection();

const path = geoPath(projection);
const ANTARCTICA = '010';

type Ping = { key: string; x: number; y: number };

// Mira's 48 books pin themselves, oldest first, as the map rises through the screen; scrolling back unpins them.
// The map itself zooms in and lies flat as it rises. Reduced motion: the finished map, still.
const LiveAtlas = () => {
  const figure = useRef<HTMLElement>(null);
  // the world's shapes are big: fetch them only once the map is a screen away
  const [near, setNear] = useState(false);
  const shapes = useWorldShapes(near);

  // how many books are pinned, and whether the last scroll added one (only then do rings ping)
  const [{ shown, grew }, setPinned] = useState(() => ({
    shown: prefersReducedMotion() ? BOOKS.length : 0,
    grew: false,
  }));

  useEffect(() => {
    const el = figure.current;

    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setNear(true);
      },
      { rootMargin: '100% 0px' }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = figure.current;

    if (!el || prefersReducedMotion()) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;

      // the window: 80% and tilted back as it enters, full size and flat once its top nears the top of the screen
      const progress = Math.min(
        1,
        Math.max(0, (innerHeight - top) / (innerHeight * GROW_SPAN))
      );

      el.style.setProperty(
        '--z',
        (START_ZOOM + (1 - START_ZOOM) * progress).toFixed(ZOOM_DIGITS)
      );

      el.style.setProperty(
        '--tilt',
        `${(START_TILT_DEG * (1 - progress)).toFixed(TILT_DIGITS)}deg`
      );

      // the books: none at the top of the page, all of them once the window's top is near the top of the screen
      const end = Math.max(1, top + scrollY - innerHeight * PINNED_AT);

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
    : shown === BOOKS.length && prefersReducedMotion()
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
            <HatchPattern id="al-hatch" size={HATCH_STAMP} />
          </defs>
          <g>
            {countries.map(({ code, d }) => (
              <AtlasCountry
                key={code}
                d={d}
                set={atlas.set.has(code)}
                author={atlas.author.has(code)}
              />
            ))}
          </g>
          {/* a ring where a book just pinned itself */}
          <g>
            {pings.map((ping) => (
              <AtlasPing key={ping.key} x={ping.x} y={ping.y} />
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
