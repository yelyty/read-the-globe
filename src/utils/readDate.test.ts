import { describe, expect, it } from 'vitest';
import type { BookEntry } from '../types';
import { byLogged, byReadDate, readOnFor } from './readDate';

const book = (
  id: string,
  readOn: string | null,
  createdAt: string
): BookEntry => ({
  id,
  title: id,
  readOn,
  createdAt,
  author: null,
  places: [],
  goals: [],
});

describe('read date', () => {
  const old = book('old', '2019-03-01', '2026-10-20T10:00:00Z'); // read long ago, logged last week
  const mid = book('mid', '2025-06-01', '2025-06-02T10:00:00Z');
  const legacy = book('legacy', null, '2026-01-05T10:00:00Z'); // no read_on yet: its logged day stands in

  it('sorts newest read first, falling back to the logged day', () => {
    expect([old, mid, legacy].sort(byReadDate).map((b) => b.id)).toEqual([
      'legacy',
      'mid',
      'old',
    ]);
  });

  it('sorts most recently logged first', () => {
    expect([mid, legacy, old].sort(byLogged).map((b) => b.id)).toEqual([
      'old',
      'legacy',
      'mid',
    ]);
  });

  it("turns the form's month into a read_on date", () => {
    const today = '2026-10-27';

    expect(readOnFor('', '', '', today)).toBeNull(); // left empty
    expect(readOnFor('03', '2019', '2019-03', today)).toBeNull(); // unchanged on an edit
    expect(readOnFor('10', '2026', '', today)).toBe('2026-10-27'); // this month: today
    expect(readOnFor('03', '2019', '', today)).toBe('2019-03-01');
    expect(readOnFor('', '2019', '', today)).toBe('2019-01-01'); // a year alone: January
    expect(readOnFor('05', '', '', today)).toBe('2026-05-01'); // a month alone: this year
  });
});
