import { useEffect, useState, type CSSProperties } from 'react';
import type { Feature } from 'geojson';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { PushPinIcon } from '@phosphor-icons/react';
import { useReveal } from '../../../../hooks/useReveal';
import { mainPiece, worldShapes } from '../../../../utils/worldShapes';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import * as s from './Closing.css';

type Mark = 'set' | 'author' | 'both';
type Stamp = {
  code: string; // numeric, as on the map
  name: string;
  mark: Mark;
  wash: string; // the disc under the country
  place: Record<string, string>; // size and spot round the promise
  n: number; // the order they press in
};
const STAMPS: Stamp[] = [
  {
    code: '036',
    name: 'Australia',
    mark: 'both',
    wash: 'var(--olive-wash)',
    place: { '--s': '92px', left: '8%', top: '16%' },
    n: 0,
  },
  {
    code: '484',
    name: 'Mexico',
    mark: 'set',
    wash: 'var(--land-t)',
    place: { '--s': '64px', left: '21%', top: '62%' },
    n: 4,
  },
  {
    code: '804',
    name: 'Ukraine',
    mark: 'author',
    wash: 'var(--rust-wash)',
    place: { '--s': '76px', left: '4%', top: '70%' },
    n: 2,
  },
  {
    code: '578',
    name: 'Norway',
    mark: 'set',
    wash: 'var(--sage)',
    place: { '--s': '56px', left: '28%', top: '8%' },
    n: 6,
  },
  {
    code: '604',
    name: 'Peru',
    mark: 'both',
    wash: 'var(--land-t)',
    place: { '--s': '84px', right: '9%', top: '14%' },
    n: 1,
  },
  {
    code: '404',
    name: 'Kenya',
    mark: 'author',
    wash: 'var(--olive-wash)',
    place: { '--s': '58px', right: '25%', top: '70%' },
    n: 5,
  },
  {
    code: '380',
    name: 'Italy',
    mark: 'set',
    wash: 'var(--rust-wash)',
    place: { '--s': '72px', right: '4%', top: '64%' },
    n: 3,
  },
  {
    code: '152',
    name: 'Chile',
    mark: 'both',
    wash: 'var(--sage)',
    place: { '--s': '52px', right: '28%', top: '8%' },
    n: 7,
  },
];

const LABEL: Record<Mark, string> = {
  set: '{country}: a story set here',
  author: '{country}: an author from here',
  both: '{country}: set here, by an author from here',
};
const FILL: Record<Mark, string> = {
  set: 'var(--olive)',
  author: 'var(--rust)',
  both: 'url(#close-hatch)',
};

// a country on its disc, fitted into the middle of a 100×100 stamp
const outline = (shape: Feature) =>
  geoPath(
    geoEquirectangular().fitExtent(
      [
        [12, 12],
        [88, 88],
      ],
      mainPiece(shape)
    )
  )(mainPiece(shape)) ?? '';

// The promise, with the stamps it will collect scattered round it: they press in, one after another, once it's in view.
const Closing = ({ onSignUp }: { onSignUp: () => void }) => {
  const [ref, revealed] = useReveal<HTMLElement>();
  const [shapes, setShapes] = useState<Record<string, Feature>>();
  useEffect(() => {
    if (revealed) void worldShapes().then(setShapes);
  }, [revealed]);

  return (
    <section
      ref={ref}
      className={revealed ? `${s.close} ${s.stamped}` : s.close}
      aria-labelledby="close-h"
    >
      <svg width="0" height="0" aria-hidden="true" className={s.defs}>
        <pattern
          id="close-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="3" height="6" fill="var(--olive)" />
          <rect x="3" width="3" height="6" fill="var(--rust)" />
        </pattern>
      </svg>
      {STAMPS.map((stamp, i) => {
        const label = LABEL[stamp.mark].replace('{country}', stamp.name);
        const shape = shapes?.[stamp.code];
        return (
          <svg
            key={stamp.code}
            className={`${s.stamp} ${s.onPhone[i % 2 ? 'hide' : i % 4 ? 'low' : 'high']}`}
            style={{ ...stamp.place, '--n': String(stamp.n) } as CSSProperties}
            viewBox="0 0 100 100"
            role="img"
            aria-label={label}
          >
            <title>{label}</title>
            <circle cx="50" cy="50" r="50" fill={stamp.wash} />
            {shape && <path d={outline(shape)} fill={FILL[stamp.mark]} />}
          </svg>
        );
      })}
      <div className={s.inner}>
        <h2 className={s.title} id="close-h">
          No streaks, no scores. Just a map that remembers what you’ve read.
        </h2>
        <button
          type="button"
          className={`${btnPrimary} ${s.cta}`}
          onClick={onSignUp}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          Start your atlas
        </button>
      </div>
    </section>
  );
};

export default Closing;
