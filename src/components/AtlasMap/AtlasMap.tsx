import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { geoEquirectangular } from 'd3-geo';
import type { Geo } from '../../types';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  type ProjectionFunction,
} from 'react-simple-maps';
import type { Marks } from '../../utils/atlasMarks';
import { m } from '../../paraglide/messages.js';
import * as s from './AtlasMap.css';

// 50m, not 110m: the low-detail map leaves out small countries, which then could never be marked
export const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';

// A flat latitude/longitude grid, as in the mock: 360° across, 83°N to 57°S down (no Antarctica).
const WIDTH = 1000;
const HEIGHT = Math.round((WIDTH * (83 + 57)) / 360);

const projection = geoEquirectangular()
  .scale(WIDTH / (2 * Math.PI))
  .center([0, (83 - 57) / 2])
  .translate([WIDTH / 2, HEIGHT / 2]);

// react-simple-maps 1.0.0 uses a projection passed as a function as-is; its @types describe a factory instead
const projectionProp = projection as unknown as ProjectionFunction;

export type Show = 'all' | 'set' | 'author';
export const ANTARCTICA = '010'; // no country, never counted, never offered

type AtlasMapProps = {
  marks: Marks;
  dots: { id: string; lon: number; lat: number }[];
  show?: Show;
  /** unmarked countries invite a book set there (Home): they lift under the pointer */
  open?: boolean;
  /** countries a pin has just landed on: they settle in */
  landed?: Set<string>;
  caption: string; // what the map shows, for screen readers
  children?: ReactNode; // laid over the map: the cartouche
};

const SLID = 'rtg-map-slid';

const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* private mode: the hint just shows again */
    }
  },
};

// mounted inside the map once its countries are drawn, so the phone frame can measure them
const Drawn = ({ onDrawn }: { onDrawn: () => void }) => {
  useEffect(onDrawn, [onDrawn]);

  return null;
};

const AtlasMap = memo(
  ({
    marks,
    dots,
    show = 'all',
    open = false,
    landed,
    caption,
    children,
  }: AtlasMapProps) => {
    /* Phones: the whole world scrolls sideways. It opens framed on the reader's own marks (the screen-wide stretch
       holding the most of them), each edge that hides more of the world fades out, and a one-time hint says it
       slides. Swiping once retires the hint. */
    const scroll = useRef<HTMLDivElement>(null);
    const framed = useRef(false);
    const auto = useRef(0);
    const [edges, setEdges] = useState({ left: false, right: false });
    const [hint, setHint] = useState(false);

    const measure = useCallback(() => {
      const el = scroll.current;

      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;

      setEdges({
        left: max > 1 && el.scrollLeft > 2,
        right: max > 1 && el.scrollLeft < max - 2,
      });
    }, []);

    const frame = useCallback(() => {
      const el = scroll.current;

      if (!el || framed.current || el.scrollWidth <= el.clientWidth + 1)
        return measure();
      framed.current = true;
      const box = el.getBoundingClientRect();

      const xs = [...el.querySelectorAll(`.${s.marked}`)]
        .map((p) => p.getBoundingClientRect())
        .filter((r) => r.width)
        .map((r) => r.left + r.width / 2)
        .sort((a, b) => a - b);

      auto.current = Date.now();
      if (xs.length) {
        let best = [xs[0]];

        xs.forEach((x, i) => {
          const g = xs.slice(i).filter((y) => y - x <= box.width * 0.8);

          if (g.length > best.length) best = g;
        });

        el.scrollLeft +=
          (best[0] + best[best.length - 1]) / 2 - (box.left + box.width / 2);
      } else el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2; // no marks yet: Europe and Africa, not the Pacific
      measure();
      setHint(store.get(SLID) !== '1');
    }, [measure]);

    useEffect(() => {
      window.addEventListener('resize', measure);

      return () => window.removeEventListener('resize', measure);
    }, [measure]);

    const onScroll = () => {
      measure();

      if (hint && Date.now() - auto.current > 400) {
        setHint(false);
        store.set(SLID, '1');
      }
    };

    return (
      <figure className={s.plate} data-show={show}>
        <div
          className={s.scroll}
          ref={scroll}
          onScroll={onScroll}
          data-more-left={edges.left || undefined}
          data-more-right={edges.right || undefined}
        >
          <ComposableMap
            className={s.map}
            projection={projectionProp}
            width={WIDTH}
            height={HEIGHT}
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="both-hatch"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" className={s.hatchSet} />
                <rect width="2" height="4" className={s.hatchAuthor} />
              </pattern>
            </defs>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo: Geo) => {
                    const mark = marks[geo.id];

                    const classes = [
                      s.land,
                      mark?.set.length && s.set,
                      mark?.author.length && s.author,
                      mark && s.marked,
                      !mark && open && geo.id !== ANTARCTICA && s.open,
                      landed?.has(geo.id) && s.landed,
                    ];

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        data-code={geo.id} // Home reads it for the tooltip, a click and the pin's flight
                        tabIndex={-1} // the country list under the map is the keyboard way in
                        className={classes.filter(Boolean).join(' ')}
                      />
                    );
                  })}
                  {geographies.length > 0 && <Drawn onDrawn={frame} />}
                </>
              )}
            </Geographies>
            <g className={s.dots}>
              {dots.map((d) => (
                <Marker key={d.id} coordinates={[d.lon, d.lat]}>
                  <circle r={2.6} className={s.dot} />
                </Marker>
              ))}
            </g>
          </ComposableMap>
        </div>
        {hint && (
          <p className={s.hint} aria-hidden="true">
            <ArrowLeftIcon />
            {m.map_slide_hint()}
            <ArrowRightIcon />
          </p>
        )}
        <figcaption className={s.srOnly}>{caption}</figcaption>
        {children}
      </figure>
    );
  }
);

AtlasMap.displayName = 'AtlasMap';

export default AtlasMap;
