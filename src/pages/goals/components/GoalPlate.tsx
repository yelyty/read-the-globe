import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection } from 'geojson';

import type { Marks } from '../../../utils/atlasMarks';
import type { Continent } from '../../../utils/continents';
import { mainPiece } from '../../../utils/world';
import { useSvgId } from '../../../hooks/useSvgId';
import HatchPattern from '../../../components/HatchPattern/HatchPattern';
import { HATCH_MAP } from '../../../components/HatchPattern/hatchSize';
import { HEIGHT, INSET, WIDTH } from '../utils/plate';
import * as styles from '../GoalsPage.css';
import PlateCountry from './PlateCountry';

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

/**
 * Shows the plate of a place goal: the countries of the goal, colored by their marks.
 * @param codes - The countries of the goal.
 * @param continent - The continent of a region goal, to frame the plate on it.
 */
export const GoalPlate = ({
  codes,
  marks,
  shapes,
  continent,
}: GoalPlateProps) => {
  const hatch = useSvgId('goal-hatch');

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
        <HatchPattern id={hatch} size={HATCH_MAP} />
      </defs>
      {features.map(([code, shape]) => (
        <PlateCountry
          key={code}
          d={path(shape) ?? ''}
          mark={marks[code]}
          hatch={hatch}
        />
      ))}
    </svg>
  );
};
