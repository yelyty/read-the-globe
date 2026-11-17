import { describe, expect, it } from 'vitest';

import { countLabel, readOptions } from './cardOptions';

const DEFAULTS = {
  kind: 'authors',
  count: 0,
  frame: 'perforated',
  color: null,
  paper: 'paper',
  goal: null,
  year: null,
};

describe('readOptions', () => {
  it('starts from the defaults when nothing was saved', () => {
    expect(readOptions(null)).toEqual(DEFAULTS);
    expect(readOptions({})).toEqual(DEFAULTS);
  });

  it('keeps every saved choice that is still on offer', () => {
    const saved = {
      kind: 'settings',
      count: 6,
      frame: 'framed',
      color: 'gold',
      paper: 'sage',
      goal: 4,
      year: '2025',
    };

    expect(readOptions(saved)).toEqual(saved);
  });

  it('falls back field by field when a value is unknown or from an older version', () => {
    expect(
      readOptions({
        kind: 'publishers',
        count: 10,
        frame: 'polaroid',
        color: 'purple',
        paper: 'sage',
      })
    ).toEqual({ ...DEFAULTS, paper: 'sage' });
  });

  it('keeps the count of every country (0) apart from a missing count', () => {
    expect(readOptions({ count: 3 }).count).toBe(3);
    expect(readOptions({ count: '3' }).count).toBe(0);
  });

  it('takes a goal only as a number and a year only as text', () => {
    expect(readOptions({ goal: '4', year: 2025 })).toMatchObject({
      goal: null,
      year: null,
    });
  });
});

describe('countLabel', () => {
  it('says how many top countries a card lists, or all of them for 0', () => {
    expect(countLabel(3)).toBe('Top 3');
    expect(countLabel(6)).toBe('Top 6');
    expect(countLabel(0)).toBe('All');
  });
});
