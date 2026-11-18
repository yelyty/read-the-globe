import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import {
  ComposableMap,
  Geographies,
  Marker,
  type ProjectionFunction,
} from 'react-simple-maps';

import type { Marks } from '../../utils/atlasMarks';
import {
  flatProjection,
  MAP_HEIGHT as HEIGHT,
  MAP_WIDTH as WIDTH,
} from '../../utils/flatMap';
import type { Geo } from '../../types';
import { GEO_URL } from '../../utils/world';
import { m } from '../../paraglide/messages.js';
import HatchPattern from '../HatchPattern/HatchPattern';
import { HATCH_MAP } from '../HatchPattern/hatchSize';
import * as styles from './AtlasMap.css';
import Drawn from './Drawn';
import MapCountry from './MapCountry';

const projection = flatProjection();

// the map scrolls sideways on a phone: an edge this close to the end counts as reached
const EDGE_SLACK = 2;
// the widest run of marks it centres on, as a share of the visible width
const FRAME_SHARE = 0.8;
// scrolls this soon after framing are the map's own, not the reader's
const AUTO_SCROLL_MS = 400;

// react-simple-maps 1.0.0 uses a projection passed as a function as-is; its @types describe a factory instead
const projectionProp = projection as unknown as ProjectionFunction;

export type Show = 'all' | 'set' | 'author';
export const ANTARCTICA = '010'; // no country, never counted, never offered

/** a pin of its own, off any country (an imagined world's place) */
type Dot = { id: number; lon: number; lat: number };

type AtlasMapProps = {
  marks: Marks;
  dots: Dot[];
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
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode: the hint just shows again */
    }
  },
};

/**
 * Shows the world map of the atlas, with each country colored by its marks.
 * On a phone, the map scrolls sideways. It opens on the part with the most marks, and a hint says that it slides.
 * @param marks - The marks of each country.
 * @param dots - The pins that are not on a country, for the places of imagined worlds.
 * @param show - Which marks to show: all, only stories set there, or only authors from there.
 * @param caption - What the map shows, for screen readers.
 */
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
        left: max > 1 && el.scrollLeft > EDGE_SLACK,
        right: max > 1 && el.scrollLeft < max - EDGE_SLACK,
      });
    }, []);

    const frame = useCallback(() => {
      const el = scroll.current;

      if (!el || framed.current || el.scrollWidth <= el.clientWidth + 1)
        return measure();
      framed.current = true;
      const box = el.getBoundingClientRect();

      const xs = [...el.querySelectorAll(`.${styles.marked}`)]
        .map((shape) => shape.getBoundingClientRect())
        .filter((rect) => rect.width)
        .map((rect) => rect.left + rect.width / 2)
        .sort((first, second) => first - second);

      auto.current = Date.now();
      if (xs.length) {
        let best = [xs[0]];

        xs.forEach((start, i) => {
          const group = xs
            .slice(i)
            .filter((other) => other - start <= box.width * FRAME_SHARE);

          if (group.length > best.length) best = group;
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

      if (hint && Date.now() - auto.current > AUTO_SCROLL_MS) {
        setHint(false);
        store.set(SLID, '1');
      }
    };

    return (
      <figure className={styles.plate} data-show={show}>
        <div
          className={styles.scroll}
          ref={scroll}
          onScroll={onScroll}
          data-more-left={edges.left || undefined}
          data-more-right={edges.right || undefined}
        >
          <ComposableMap
            className={styles.map}
            projection={projectionProp}
            width={WIDTH}
            height={HEIGHT}
            aria-hidden="true"
          >
            <defs>
              <HatchPattern id="both-hatch" size={HATCH_MAP} />
            </defs>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo: Geo) => (
                    <MapCountry
                      key={geo.rsmKey}
                      geo={geo}
                      mark={marks[geo.id]}
                      open={open && geo.id !== ANTARCTICA}
                      landed={Boolean(landed?.has(geo.id))}
                    />
                  ))}
                  {geographies.length > 0 && <Drawn onDrawn={frame} />}
                </>
              )}
            </Geographies>
            <g className={styles.dots}>
              {dots.map((dot) => (
                <Marker key={dot.id} coordinates={[dot.lon, dot.lat]}>
                  <circle r={2.6} className={styles.dot} />
                </Marker>
              ))}
            </g>
          </ComposableMap>
        </div>
        {hint && (
          <p className={styles.hint} aria-hidden="true">
            <ArrowLeftIcon />
            {m.map_slide_hint()}
            <ArrowRightIcon />
          </p>
        )}
        <figcaption className={styles.srOnly}>{caption}</figcaption>
        {children}
      </figure>
    );
  }
);

AtlasMap.displayName = 'AtlasMap';

export default AtlasMap;
