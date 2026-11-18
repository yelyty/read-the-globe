import { describe, expect, it } from 'vitest';

import { formatDay, formatMonth, romanDate } from './formatDate';

describe('formatMonth', () => {
  it('says a day as its month and year', () => {
    expect(formatMonth('2026-03-09')).toBe('Mar 2026');
  });

  it('says nothing for no day', () => {
    expect(formatMonth('')).toBe('');
  });

  // a day read at midnight UTC would slip into the day before west of Greenwich
  it('keeps the first of a month in that month', () => {
    expect(formatMonth('2026-01-01')).toBe('Jan 2026');
  });
});

describe('formatDay', () => {
  it('says a day in full', () => {
    expect(formatDay('2026-03-09')).toBe('Mar 9, 2026');
  });
});

describe('romanDate', () => {
  it('writes the postmark date: day, Roman month, two-digit year', () => {
    expect(romanDate('2026-10-04')).toBe('4 X 26');
  });

  it('covers the first and last months', () => {
    expect(romanDate('2025-01-31')).toBe('31 I 25');
    expect(romanDate('2025-12-01')).toBe('1 XII 25');
  });

  it('keeps a leading zero in the year', () => {
    expect(romanDate('2005-07-15')).toBe('15 VII 05');
  });
});
