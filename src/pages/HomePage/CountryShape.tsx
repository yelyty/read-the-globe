import { useEffect, useId, useState } from "react";
import { geoArea, geoEquirectangular, geoPath } from "d3-geo";
import type { Feature, Polygon } from "geojson";
import type { Mark } from "../../utils/atlasMarks";
import { worldShapes } from "../../utils/worldShapes";
import * as s from "./HomePage.css";

const mainPiece = (f: Feature): Feature => {
  if (f.geometry.type !== "MultiPolygon") return f;
  const pieces = f.geometry.coordinates.map(
    (coordinates): Feature<Polygon> => ({
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates },
    }),
  );
  return pieces.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
};

type CountryShapeProps = {
  code: string;
  mark: Mark;
  width: number;
  height: number;
};

// One country's outline, filled with its mark from the map: olive, rust, or the hatch for both.
const CountryShape = ({ code, mark, width, height }: CountryShapeProps) => {
  const [shape, setShape] = useState<Feature>();
  // useId gives «r0»-style ids; an SVG url() wants plain letters
  const hatch = "hatch-" + useId().replace(/[^\w-]/g, "");
  useEffect(() => {
    worldShapes().then((all) => setShape(all[code]));
  }, [code]);
  if (!shape) return <svg width={width} height={height} aria-hidden="true" />;

  const pad = Math.min(width, height) * 0.06;
  const projection = geoEquirectangular().fitExtent(
    [
      [pad, pad],
      [width - pad, height - pad],
    ],
    mainPiece(shape),
  );
  const both = mark.set.length > 0 && mark.author.length > 0;
  const fill = both
    ? `url(#${hatch})`
    : mark.set.length
      ? s.shapeSet
      : s.shapeAuthor;
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
          <pattern
            id={hatch}
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="6" className={s.shapeSet} />
            <rect width="3" height="6" className={s.shapeAuthor} />
          </pattern>
        </defs>
      )}
      <path
        d={geoPath(projection)(shape) ?? ""}
        className={both ? undefined : fill}
        style={both ? { fill } : undefined}
      />
    </svg>
  );
};

export default CountryShape;
