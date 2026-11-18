import { describe, expect, it } from 'vitest';

import { isoDay, isoMonth, isoYear, isoYearMonth } from './isoDate';

describe('ISO date parts', () => {
  it('reads the year, year and month, and month of a day', () => {
    expect(isoYear('2026-03-09')).toBe('2026');
    expect(isoYearMonth('2026-03-09')).toBe('2026-03');
    expect(isoMonth('2026-03-09')).toBe('03');
  });

  it('cuts a full timestamp down to its day', () => {
    expect(isoDay('2026-03-09T21:45:00.000Z')).toBe('2026-03-09');
  });

  it('leaves a bare day as it is', () => {
    expect(isoDay('2026-03-09')).toBe('2026-03-09');
  });
});
