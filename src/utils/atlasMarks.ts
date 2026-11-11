import type { BookEntry } from '../types';
import { CONTINENT_OF } from './continents';
import { PARENT } from './countryFrom';

// Every book leaves two kinds of mark: the countries its story is set in, and its author's country.
// A territory (Greenland) marks its own shape and the country it belongs to (Denmark).
export type Mark = { set: BookEntry[]; author: BookEntry[] };
export type Marks = Record<string, Mark>;

export function atlasMarks(books: BookEntry[]): Marks {
  const marks: Marks = {};
  const at = (code: string) => (marks[code] ??= { set: [], author: [] });

  const withParent = (code: string) =>
    PARENT[code] ? [code, PARENT[code]] : [code];

  for (const book of books) {
    const authorCountry = book.author?.country?.code;

    if (authorCountry)
      for (const code of withParent(authorCountry)) at(code).author.push(book);

    const setIn = new Set(
      (book.places ?? []).flatMap((p) =>
        p.countryCode ? withParent(p.countryCode) : []
      )
    );

    for (const code of setIn) at(code).set.push(book);
  }

  return marks;
}

// a territory's own shape is painted but not counted: its country is
export const counted = (marks: Marks) =>
  Object.keys(marks).filter((c) => !PARENT[c]);

export function atlasStats(books: BookEntry[], marks: Marks) {
  const codes = counted(marks);

  return {
    books: books.length,
    countries: codes.length,
    set: codes.filter((c) => marks[c].set.length).length,
    authors: codes.filter((c) => marks[c].author.length).length,
    continents: new Set(codes.map((c) => CONTINENT_OF[c]).filter(Boolean)).size,
  };
}
