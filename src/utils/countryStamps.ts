import { geoEquirectangular, geoPath } from 'd3-geo';
import type { Feature, MultiPolygon, Polygon, Position } from 'geojson';

import { worldShapes } from './world';

/* The world's countries framed as stamps: each map shape with the frame of its main landmass, on one flat projection.
   The postcard draws them on canvas; the Shelf shows one as an SVG in its country header and next reads. */

export type Country = { shape: Feature<Polygon | MultiPolygon>; main: Box };

// the flat world the stamps are cut from: 360° across 1000 units, 180° down 500, centred on the middle
const WORLD_WIDTH = 1000;
const WORLD_HEIGHT = WORLD_WIDTH / 2;
const DEGREES_ACROSS = 360;
const UNITS_PER_DEGREE = WORLD_WIDTH / DEGREES_ACROSS;
// a ring spanning more than half the world wraps the date line
const HALF_WORLD_DEG = DEGREES_ACROSS / 2;

export const projection = geoEquirectangular()
  .scale(WORLD_WIDTH / (2 * Math.PI))
  .translate([WORLD_WIDTH / 2, WORLD_HEIGHT / 2]);

// a stamp's outline keeps this share of its longer side clear round the country
const OUTLINE_PAD = 0.06;

type Box = [[number, number], [number, number]];

let stamped: Promise<Map<string, Country>> | null = null;

/**
 * Loads the shapes of the map once. Each country also gets the frame of its biggest landmass.
 */
export const loadCountries = () => {
  stamped ??= worldShapes().then((shapes) => {
    const countries = new Map<string, Country>();

    for (const [code, shape] of Object.entries(shapes)) {
      const { geometry } = shape;

      if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')
        continue;

      const coordinates =
        geometry.type === 'Polygon'
          ? [geometry.coordinates]
          : geometry.coordinates;

      // a stamp frames the country's main landmass, not the islands far out at sea
      const { box: main } = coordinates
        .map(flatBox)
        .reduce((largest, candidate) =>
          candidate.area > largest.area ? candidate : largest
        );

      countries.set(code, {
        shape: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'MultiPolygon', coordinates },
        },
        main,
      });
    }

    return countries;
  });

  return stamped;
};

// a ring's size and frame on the flat map. ponytail: planar on purpose; d3's spherical area and bounds read
// a ring that wraps the date line (Russia's mainland) as nearly the whole globe. A ring that runs on past 180°
// (into Chukotka) is unwrapped first, so its frame sits on the mainland and the far end is clipped by the stamp.
const flatBox = ([outer]: Position[][]) => {
  const lons = outer.map((point) => point[0]);
  const wraps = Math.max(...lons) - Math.min(...lons) > HALF_WORLD_DEG;

  // the projection's own arithmetic: UNITS_PER_DEGREE a degree, centred on the middle of the world
  const pts = outer.map(([lon, lat]) => [
    WORLD_WIDTH / 2 +
      (wraps && lon < 0 ? lon + DEGREES_ACROSS : lon) * UNITS_PER_DEGREE,
    WORLD_HEIGHT / 2 - lat * UNITS_PER_DEGREE,
  ]);

  let area = 0;

  pts.forEach(([px, py], i) => {
    const [nx, ny] = pts[(i + 1) % pts.length];

    area += px * ny - nx * py;
  });

  const xs = pts.map((point) => point[0]);
  const ys = pts.map((point) => point[1]);

  const box: Box = [
    [Math.min(...xs), Math.min(...ys)],
    [Math.max(...xs), Math.max(...ys)],
  ];

  return { area: Math.abs(area) / 2, box };
};

/**
 * Gets the outline of a country as SVG, framed on its biggest landmass like a stamp. The Shelf shows it in the country header.
 * @returns The SVG path, its viewBox, and its width.
 */
export const countryStamp = ({
  shape,
  main: [[x0, y0], [x1, y1]],
}: Country) => {
  const pad = Math.max(x1 - x0, y1 - y0) * OUTLINE_PAD;

  const viewBox = [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2]
    .map((value) => value.toFixed(1))
    .join(' ');

  return {
    d: geoPath(projection)(shape) ?? '',
    viewBox,
    width: x1 - x0 + pad * 2,
  };
};
