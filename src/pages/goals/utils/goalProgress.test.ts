import { describe, expect, it } from 'vitest';

import type { BookEntry } from '../../../types';
import { atlasMarks } from '../../../utils/atlasMarks';
import { CONTINENT_OF } from '../../../utils/continents';
import { MAP_CODES } from '../../../utils/world';
import { goalProgress, isDone, type GoalDraft } from './goalProgress';

const FRANCE = '250';
const ITALY = '380';
const JAPAN = '392';
const DENMARK = '208';
const GREENLAND = '304';
// in Europe by the continent table, but not a country the map draws
const GIBRALTAR = '292';

const book = (
  id: string,
  {
    author,
    places = [],
    goals = [],
  }: { author?: string; places?: string[]; goals?: number[] }
): BookEntry => ({
  id,
  title: id,
  author: author
    ? { name: 'Someone', country: { code: author, name: '' } }
    : null,
  places: places.map((countryCode, i) => ({
    id: `${id}-${i}`,
    name: '',
    lon: 0,
    lat: 0,
    countryCode,
    bookId: id,
  })),
  goals: goals.map((goalId) => ({ goalId })),
});

const progressOf = (goal: GoalDraft & { id?: number }, books: BookEntry[]) =>
  goalProgress(goal, atlasMarks(books), books);

const countries = (codes: string[]): GoalDraft => ({
  kind: 'countries',
  name: 'Some countries',
  continent: null,
  countryCodes: codes,
  target: null,
});

describe('goal progress', () => {
  it('counts the books ticked toward a theme', () => {
    const theme = {
      id: 7,
      kind: 'theme' as const,
      name: 'Translated',
      continent: null,
      countryCodes: null,
      target: 2,
    };

    const one = [book('a', { goals: [7] }), book('b', { goals: [8] })];

    expect(progressOf(theme, one)).toMatchObject({ done: 1, total: 2 });
    expect(isDone(progressOf(theme, one))).toBe(false);

    expect(isDone(progressOf(theme, [...one, book('c', { goals: [7] })]))).toBe(
      true
    );
  });

  it('counts a country once it has either mark: a story set there or an author from there', () => {
    const goal = countries([FRANCE, ITALY, JAPAN]);

    const books = [
      book('set', { places: [FRANCE] }),
      book('author', { author: ITALY }),
    ];

    expect(progressOf(goal, books)).toEqual({
      done: 2,
      total: 3,
      all: [FRANCE, ITALY, JAPAN],
      reached: [FRANCE, ITALY],
    });
  });

  it('is reached when every country is marked', () => {
    const goal = countries([FRANCE, ITALY]);

    expect(
      isDone(progressOf(goal, [book('a', { places: [FRANCE, ITALY] })]))
    ).toBe(true);
  });

  it('counts a territory toward the country it belongs to', () => {
    const goal = countries([DENMARK]);

    expect(isDone(progressOf(goal, [book('a', { places: [GREENLAND] })]))).toBe(
      true
    );
  });

  it("counts a region's countries on the map, without needing the map loaded", () => {
    const europe = {
      kind: 'region' as const,
      name: 'Europe',
      continent: 'EU' as const,
      countryCodes: null,
      target: null,
    };

    const progress = progressOf(europe, [book('a', { places: [FRANCE] })]);

    expect(progress.total).toBe(
      MAP_CODES.filter((code) => CONTINENT_OF[code] === 'EU').length
    );

    expect(progress.reached).toEqual([FRANCE]);
    // a place the map can't draw could never be marked, so it isn't asked for
    expect(CONTINENT_OF[GIBRALTAR]).toBe('EU');
    expect(progress.all).not.toContain(GIBRALTAR);
  });

  it('is never reached with nothing to reach', () => {
    expect(isDone(progressOf(countries([]), []))).toBe(false);
  });
});
