import type { BookEntry } from '../types';
import { authorCountry, storyCountries } from './book';
import { CONTINENT_OF } from './continents';
import { PARENT } from './countryFrom';

// Every book leaves two kinds of mark: the countries its story is set in, and its author's country.
// A territory (Greenland) marks its own shape and the country it belongs to (Denmark).
export type Mark = { set: BookEntry[]; author: BookEntry[] };
export type Marks = Record<string, Mark>;
export type MarkWhich = 'set' | 'author' | 'both';

/**
 * Gets which mark a country shows: a story set there, an author from there, or both (the hatch).
 */
export const markWhich = (set: boolean, author: boolean): MarkWhich =>
  set && author ? 'both' : set ? 'set' : 'author';

/**
 * Gets which mark a country shows, from its books.
 */
export const markOf = (mark: Mark): MarkWhich =>
  markWhich(mark.set.length > 0, mark.author.length > 0);

/**
 * Gets the marks of the atlas: for each country, the books set there and the books by authors from there.
 * A territory also marks the country it belongs to.
 */
export function atlasMarks(books: BookEntry[]): Marks {
  const marks: Marks = {};
  const at = (code: string) => (marks[code] ??= { set: [], author: [] });

  const withParent = (code: string) =>
    PARENT[code] ? [code, PARENT[code]] : [code];

  for (const book of books) {
    const author = authorCountry(book);

    if (author)
      for (const code of withParent(author)) at(code).author.push(book);

    const setIn = new Set(storyCountries(book).flatMap(withParent));

    for (const code of setIn) at(code).set.push(book);
  }

  return marks;
}

/**
 * Gets the countries that count. A territory has its own shape on the map, but its country is counted instead.
 */
export const counted = (marks: Marks) =>
  Object.keys(marks).filter((code) => !PARENT[code]);

/**
 * Gets the numbers of the atlas: books, countries, countries with a story, countries with an author, and continents.
 */
export function atlasStats(books: BookEntry[], marks: Marks) {
  const codes = counted(marks);

  return {
    books: books.length,
    countries: codes.length,
    set: codes.filter((code) => marks[code].set.length).length,
    authors: codes.filter((code) => marks[code].author.length).length,
    continents: new Set(codes.map((code) => CONTINENT_OF[code]).filter(Boolean))
      .size,
  };
}
