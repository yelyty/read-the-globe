import { useId } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection } from 'geojson';
import type { Marks } from '../../utils/atlasMarks';
import type { Continent } from '../../utils/continents';
import { mainPiece } from '../../utils/worldShapes';
import * as styles from './GoalsPage.css';

const WIDTH = 176;
const HEIGHT = 110;

const CROP: Partial<Record<Continent, Feature>> = {
  EU: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [-25, 72],
        [60, 34],
      ],
    },
  },
};

type GoalPlateProps = {
  codes: string[];
  marks: Marks;
  shapes: Record<string, Feature>;
  continent?: Continent | null;
};

export const GoalPlate = ({
  codes,
  marks,
  shapes,
  continent,
}: GoalPlateProps) => {
  const hatch = 'goal-hatch-' + useId().replace(/[^\w-]/g, '');

  const features = codes
    .map((code) => [code, shapes[code]] as const)
    .filter(([, shape]) => shape);

  if (!features.length)
    return <div className={styles.plate} aria-hidden="true" />;

  const crop = continent && CROP[continent];

  const frame: FeatureCollection = {
    type: 'FeatureCollection',
    features: crop ? [crop] : features.map(([, shape]) => mainPiece(shape)),
  };

  const path = geoPath(
    geoEquirectangular().fitExtent(
      [
        [8, 8],
        [WIDTH - 8, HEIGHT - 8],
      ],
      frame
    )
  );

  return (
    <svg
      className={styles.plate}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={hatch}
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
          patternTransform="rotate(45)"
        >
          <rect width="4" height="4" className={styles.shapeSet} />
          <rect width="2" height="4" className={styles.shapeAuthor} />
        </pattern>
      </defs>
      {features.map(([code, shape]) => {
        const mark = marks[code];
        const both = mark && mark.set.length > 0 && mark.author.length > 0;

        const cls = !mark
          ? styles.shapeTodo
          : both
            ? styles.shapeMarked
            : mark.set.length
              ? styles.shapeSet
              : styles.shapeAuthor;

        return (
          <path
            key={code}
            d={path(shape) ?? ''}
            className={cls}
            style={both ? { fill: `url(#${hatch})` } : undefined}
          />
        );
      })}
    </svg>
  );
};

export const GoalShelf = ({ done, total }: { done: number; total: number }) => {
  const count = Math.min(total, 20);

  const filled =
    total <= 20
      ? Math.min(done, count)
      : Math.round(Math.min(1, done / total) * count);

  const gap = 3;
  const sw = Math.min(14, (WIDTH - 24 - gap * (count - 1)) / count);
  const x0 = (WIDTH - (sw * count + gap * (count - 1))) / 2;
  const base = HEIGHT - 22;

  return (
    <svg
      className={styles.plate}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: count }, (_unused, i) => {
        const height = 44 + ((i * 37) % 23);

        return (
          <rect
            key={i}
            className={i < filled ? styles.spineIn : styles.spine}
            x={x0 + i * (sw + gap)}
            y={base - height}
            width={sw}
            height={height}
            rx="1.5"
          />
        );
      })}
      <line
        className={styles.plank}
        x1="10"
        x2={WIDTH - 10}
        y1={base + 1}
        y2={base + 1}
      />
    </svg>
  );
};

export const Compass = () => (
  <svg
    className={styles.compass}
    viewBox="-12 -12 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle r="8.5" />
    <path className={styles.compassNorth} d="M0-11 2.2-1.6 0 0-2.2-1.6Z" />
    <path d="M0 11 2.2 1.6 0 0-2.2 1.6ZM11 0 1.6 2.2 0 0 1.6-2.2ZM-11 0-1.6 2.2 0 0-1.6-2.2Z" />
  </svg>
);
