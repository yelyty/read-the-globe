import type { Feature, Position } from 'geojson';
import { describe, expect, it } from 'vitest';

import { outline } from './outline';

// a square of `size` degrees from (lon, lat), wound clockwise as d3-geo expects
const square = (lon: number, lat: number, size: number): Position[] => [
  [lon, lat],
  [lon, lat + size],
  [lon + size, lat + size],
  [lon + size, lat],
  [lon, lat],
];

const numbers = (path: string) =>
  [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map(([value]) => Number(value));

describe('outline', () => {
  it('fits a country inside the stamp’s 12px margin', () => {
    const path = outline({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [square(0, 0, 10)] },
    });

    expect(path).toMatch(/^M/);

    for (const value of numbers(path)) {
      expect(value).toBeGreaterThanOrEqual(12 - 1e-6);
      expect(value).toBeLessThanOrEqual(88 + 1e-6);
    }
  });

  it('draws only a country’s biggest landmass', () => {
    const shape: Feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [[square(100, 0, 1)], [square(0, 0, 10)]],
      },
    };

    // one ring: the far-away island is left out
    expect(outline(shape).match(/M/g)).toHaveLength(1);
  });
});
