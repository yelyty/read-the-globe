import { useEffect, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature } from 'geojson';

import { markOf, type Mark } from '../../../../utils/atlasMarks';
import { mainPiece, worldShapes } from '../../../../utils/world';
import { useSvgId } from '../../../../hooks/useSvgId';
import HatchPattern from '../../../../components/HatchPattern/HatchPattern';
import { HATCH_STAMP } from '../../../../components/HatchPattern/hatchSize';
import * as styles from '../../HomePage.css';

// the space round a country's shape, as a share of its box's shorter side
const PAD_SHARE = 0.06;

type CountryShapeProps = {
  code: string;
  mark: Mark;
  width: number;
  height: number;
};

// One country's outline, filled with its mark from the map: olive, rust, or the hatch for both.
const CountryShape = ({ code, mark, width, height }: CountryShapeProps) => {
  const [shape, setShape] = useState<Feature>();
  const hatch = useSvgId('hatch');

  useEffect(() => {
    worldShapes().then((all) => setShape(all[code]));
  }, [code]);

  if (!shape) return <svg width={width} height={height} aria-hidden="true" />;

  const pad = Math.min(width, height) * PAD_SHARE;

  const projection = geoEquirectangular().fitExtent(
    [
      [pad, pad],
      [width - pad, height - pad],
    ],
    mainPiece(shape)
  );

  const both = markOf(mark) === 'both';

  const fill = both
    ? `url(#${hatch})`
    : mark.set.length
      ? styles.shapeSet
      : styles.shapeAuthor;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      {both && (
        <defs>
          <HatchPattern id={hatch} size={HATCH_STAMP} />
        </defs>
      )}
      <path
        d={geoPath(projection)(shape) ?? ''}
        className={both ? undefined : fill}
        style={both ? { fill } : undefined}
      />
    </svg>
  );
};

export default CountryShape;
