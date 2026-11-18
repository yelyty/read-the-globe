import { describe, expect, it } from 'vitest';

import { flatProjection, MAP_HEIGHT, MAP_WIDTH } from './flatMap';

describe('the flat map', () => {
  it('is 360° wide and 83°N to 57°S high, in proportion', () => {
    expect(MAP_WIDTH).toBe(1000);
    expect(MAP_HEIGHT).toBe(Math.round((1000 * 140) / 360));
  });

  it('puts the corners of its grid at the corners of the map', () => {
    const project = flatProjection();

    const [left, top] = project([-180, 83])!;
    const [right, bottom] = project([180, -57])!;

    expect(left).toBeCloseTo(0);
    // MAP_HEIGHT is rounded to whole pixels, so the edges sit within a pixel
    expect(top).toBeCloseTo(0, 0);
    expect(right).toBeCloseTo(MAP_WIDTH);
    expect(bottom).toBeCloseTo(MAP_HEIGHT, 0);
  });

  it('puts the prime meridian in the middle', () => {
    expect(flatProjection()([0, 0])![0]).toBeCloseTo(MAP_WIDTH / 2);
  });

  it('makes a fresh projection each time', () => {
    expect(flatProjection()).not.toBe(flatProjection());
  });
});
