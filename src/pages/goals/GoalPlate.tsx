import { useId } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection } from 'geojson';

import type { Marks } from '../../utils/atlasMarks';
import type { Continent } from '../../utils/continents';
import { mainPiece } from '../../utils/worldShapes';
import { HEIGHT, INSET, WIDTH } from './plate';
import * as styles from './GoalsPage.css';

// Europe on a plate is the mainland and the islands near it, not Russia to the Pacific
const EUROPE_WEST = -25;
const EUROPE_NORTH = 72;
const EUROPE_EAST = 60;
const EUROPE_SOUTH = 34;

const CROP: Partial<Record<Continent, Feature>> = {
  EU: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [EUROPE_WEST, EUROPE_NORTH],
        [EUROPE_EAST, EUROPE_SOUTH],
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
        [INSET, INSET],
        [WIDTH - INSET, HEIGHT - INSET],
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
