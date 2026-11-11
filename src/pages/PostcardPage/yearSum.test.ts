import { describe, expect, it } from 'vitest';
import type { BookEntry, Goal } from '../../types';
import { romanDate } from '../GoalsPage/goals';
import { bookYears, yearSum } from './yearSum';

const book = (
  id: string,
  readOn: string,
  author: string,
  places: string[],
  goals: number[] = []
): BookEntry => ({
  id,
  title: id,
  readOn,
  author: { name: 'A', country: { name: author, code: author } },
  places: places.map((countryCode, i) => ({
    id: `${id}${i}`,
    name: '',
    lon: 0,
    lat: 0,
    countryCode,
    bookId: id,
  })),
  goals: goals.map((goalId) => ({ goalId })),
});

const theme = (id: number, name: string): Goal => ({
  id,
  kind: 'theme',
  name,
  continent: null,
  countryCodes: null,
  target: 5,
  reachedOn: null,
});

// France (EU), Japan (AS), Brazil (SA)
const books = [
  book('a', '2025-03-01', '250', ['250']),
  book('b', '2026-02-01', '250', ['392']),
  book('c', '2026-07-01', '076', []),
];

describe('yearSum', () => {
  it('lists the years with books, newest first', () => {
    expect(bookYears(books)).toEqual(['2026', '2025']);
  });

  it("counts the year's countries and says how many are new", () => {
    expect(yearSum('2026', books, []).line).toBe(
      '2026: 3 countries, 3 continents, 2 new to my atlas.'
    );
  });

  it('names the theme the year fed most, a Stories set in… theme as stories', () => {
    const goals = [
      theme(1, 'Books in translation'),
      theme(2, 'Stories set in the Arctic'),
    ];

    books[1].goals = [{ goalId: 1 }, { goalId: 2 }];

    expect(yearSum('2026', books, goals).line).toBe(
      '2026: 3 countries, 3 continents, 1 Arctic story.'
    );
  });
});

describe('romanDate', () => {
  it("writes the postmark's date with a Roman month", () => {
    expect(romanDate('2026-10-04')).toBe('4 X 26');
  });
});
