import { describe, expect, it } from 'vitest';

import type { BookEntry, Place } from '../types';
import { authorCountry, bookCountries, storyCountries } from './book';
import { readYear } from './readDate';

const FRANCE = '250';
const ITALY = '380';
const JAPAN = '392';

const place = (code: string | null, imagined = false): Place => ({
  id: 0,
  name: imagined ? 'Narnia' : '',
  lon: 0,
  lat: 0,
  countryCode: code,
  bookId: 1,
  imagined,
});

const book = (extra: Partial<BookEntry>): BookEntry => ({
  id: 1,
  title: 'A book',
  author: null,
  places: [],
  goals: [],
  ...extra,
});

describe('a book’s countries', () => {
  it('reads where the author is from, when it is known', () => {
    expect(
      authorCountry(
        book({ author: { name: 'A', country: { code: JAPAN, name: '' } } })
      )
    ).toBe(JAPAN);

    expect(
      authorCountry(book({ author: { name: 'A', country: null } }))
    ).toBeUndefined();

    expect(authorCountry(book({ author: null }))).toBeUndefined();
  });

  it('reads where the story is set, in order, leaving imagined worlds out', () => {
    const places = [place(FRANCE), place(null, true), place(ITALY)];

    expect(storyCountries(book({ places }))).toEqual([FRANCE, ITALY]);
  });

  it('copes with a book saved without places', () => {
    const noPlaces = { ...book({}), places: undefined } as unknown as BookEntry;

    expect(storyCountries(noPlaces)).toEqual([]);
  });

  it('lists both marks: the author’s country first, then the story’s', () => {
    const both = book({
      author: { name: 'A', country: { code: JAPAN, name: '' } },
      places: [place(FRANCE), place(JAPAN)],
    });

    expect(bookCountries(both)).toEqual([JAPAN, FRANCE, JAPAN]);
    expect(bookCountries(book({ places: [place(ITALY)] }))).toEqual([ITALY]);
  });

  it('reads the year it was read, or the year it was logged without a read date', () => {
    expect(readYear(book({ readOn: '2024-03-01' }))).toBe('2024');

    expect(
      readYear(book({ readOn: null, createdAt: '2026-01-02T10:00:00Z' }))
    ).toBe('2026');
  });
});
