import { useId } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import type { Marks } from "../../utils/atlasMarks";
import type { Continent } from "../../utils/continents";
import { mainPiece } from "../../utils/worldShapes";
import * as s from "./GoalsPage.css";

const W = 176;
const H = 110;

const CROP: Partial<Record<Continent, Feature>> = {
  EU: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPoint",
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
  const hatch = "goal-hatch-" + useId().replace(/[^\w-]/g, "");
  const features = codes
    .map((c) => [c, shapes[c]] as const)
    .filter(([, f]) => f);
  if (!features.length) return <div className={s.plate} aria-hidden="true" />;

  const crop = continent && CROP[continent];
  const frame: FeatureCollection = {
    type: "FeatureCollection",
    features: crop ? [crop] : features.map(([, f]) => mainPiece(f)),
  };
  const path = geoPath(
    geoEquirectangular().fitExtent(
      [
        [8, 8],
        [W - 8, H - 8],
      ],
      frame,
    ),
  );

  return (
    <svg
      className={s.plate}
      viewBox={`0 0 ${W} ${H}`}
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
          <rect width="4" height="4" className={s.shapeSet} />
          <rect width="2" height="4" className={s.shapeAuthor} />
        </pattern>
      </defs>
      {features.map(([code, f]) => {
        const m = marks[code];
        const both = m && m.set.length > 0 && m.author.length > 0;
        const cls = !m
          ? s.shapeTodo
          : both
            ? s.shapeMarked
            : m.set.length
              ? s.shapeSet
              : s.shapeAuthor;
        return (
          <path
            key={code}
            d={path(f) ?? ""}
            className={cls}
            style={both ? { fill: `url(#${hatch})` } : undefined}
          />
        );
      })}
    </svg>
  );
};

export const GoalShelf = ({ done, total }: { done: number; total: number }) => {
  const n = Math.min(total, 20);
  const filled =
    total <= 20 ? Math.min(done, n) : Math.round(Math.min(1, done / total) * n);
  const gap = 3;
  const sw = Math.min(14, (W - 24 - gap * (n - 1)) / n);
  const x0 = (W - (sw * n + gap * (n - 1))) / 2;
  const base = H - 22;
  return (
    <svg
      className={s.plate}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: n }, (_, i) => {
        const h = 44 + ((i * 37) % 23);
        return (
          <rect
            key={i}
            className={i < filled ? s.spineIn : s.spine}
            x={x0 + i * (sw + gap)}
            y={base - h}
            width={sw}
            height={h}
            rx="1.5"
          />
        );
      })}
      <line
        className={s.plank}
        x1="10"
        x2={W - 10}
        y1={base + 1}
        y2={base + 1}
      />
    </svg>
  );
};

export const Compass = () => (
  <svg
    className={s.compass}
    viewBox="-12 -12 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle r="8.5" />
    <path className={s.compassNorth} d="M0-11 2.2-1.6 0 0-2.2-1.6Z" />
    <path d="M0 11 2.2 1.6 0 0-2.2 1.6ZM11 0 1.6 2.2 0 0 1.6-2.2ZM-11 0-1.6 2.2 0 0-1.6-2.2Z" />
  </svg>
);
