import { describe, expect, it } from 'vitest';

import type { BookEntry } from '../../../types';
import type { Marks } from '../../../utils/atlasMarks';
import { idFor } from '../../../testing/idFor';
import { KINDS, YEAR, postcardStats } from './drawPostcard';

const book = (
  id: string,
  author: string | null,
  places: string[]
): BookEntry => ({
  id: idFor(id),
  title: id,
  readOn: '2026-01-01',
  author: author
    ? { name: 'A', country: { name: author, code: author } }
    : null,
  places: places.map((countryCode, i) => ({
    id: i,
    name: '',
    lon: 0,
    lat: 0,
    countryCode,
    bookId: idFor(id),
  })),
  goals: [],
});

// newest first, as the shelf hands them over: France (EU), Japan (AS), Brazil (SA)
const newest = book('newest', '250', ['392']);
const middle = book('middle', '076', ['392']);
// an author's country the atlas has no mark for
const oldest = book('oldest', '999', []);

const books = [newest, middle, oldest];

const marks: Marks = {
  '250': { set: [], author: [newest] },
  '392': { set: [newest, middle], author: [] },
  '076': { set: [], author: [middle] },
};

describe('postcardStats', () => {
  it("collects the authors' countries, newest book first", () => {
    expect(postcardStats(books, marks, KINDS.authors)).toEqual({
      order: ['250', '076'],
      countries: 2,
      continents: 2,
      books: 2,
    });
  });

  it("collects the stories' countries once each", () => {
    expect(postcardStats(books, marks, KINDS.settings)).toEqual({
      order: ['392'],
      countries: 1,
      continents: 1,
      books: 2,
    });
  });

  it("collects both kinds for a year's card", () => {
    expect(postcardStats(books, marks, YEAR)).toEqual({
      order: ['250', '392', '076'],
      countries: 3,
      continents: 3,
      books: 2,
    });
  });

  it("leaves out a country whose mark is the other kind's", () => {
    const setInFrance = book('setInFrance', null, ['250']);

    expect(postcardStats([setInFrance], marks, KINDS.settings)).toEqual({
      order: [],
      countries: 0,
      continents: 0,
      books: 0,
    });
  });

  it('counts nothing on an empty shelf', () => {
    expect(postcardStats([], {}, KINDS.authors)).toEqual({
      order: [],
      countries: 0,
      continents: 0,
      books: 0,
    });
  });
});
