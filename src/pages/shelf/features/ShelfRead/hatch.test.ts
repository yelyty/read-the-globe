import { describe, expect, it } from 'vitest';

import { hatchSize } from './hatch';

describe('hatchSize', () => {
  it('repeats every 6px on a 128px stamp', () => {
    expect(hatchSize(128)).toBe(6);
  });

  it('scales with the stamp', () => {
    expect(hatchSize(64)).toBe(3);
    expect(hatchSize(256)).toBe(12);
  });
});
