import type { BookEntry, Goal } from '../../types';
import type { Marks } from '../../utils/atlasMarks';
import { authorCountry, storyCountries } from '../../utils/book';
import { CONTINENT_OF, type Continent } from '../../utils/continents';
import { countryFrom, PARENT } from '../../utils/countryFrom';
import { byReadDate, readYear } from '../../utils/readDate';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import { goalHas } from '../goals/goalProgress';

/* What the Shelf shows for a search, its filters and its sort, apart from the page that draws it. */

export type Sort = 'new' | 'title' | 'country';
/** which mark a place filter counts: '' either, 'set' where the story is set, 'author' where the author is from */
export type Mark = '' | 'set' | 'author';

export type ShelfFilters = {
  /** typed in the search: matched against title, author, and every country and place name */
  query: string;
  /** the country page's country (?country=) */
  country?: string;
  continent: Continent | '';
  mark: Mark;
  /** YYYY, or '' for every year */
  year: string;
  /** the goal whose books to show */
  goal?: Goal;
  sort: Sort;
};

type Context = {
  names: Record<string, string>;
  /** the whole shelf's marks, to tell whether a searched country has any books */
  marks: Marks;
};

export type ShelfView = {
  /** the books to show, in order */
  list: BookEntry[];
  /** nothing is filtered out: years can fold */
  unfiltered: boolean;
  /** a search that names a country with no books yet: the country to invite a first book for */
  invite: string | null;
};

// a place filter can count where the story is set, where the author is from, or either
const hits = (book: BookEntry, mark: Mark, test: (code: string) => boolean) => {
  const author = authorCountry(book);

  return (
    (mark !== 'author' && storyCountries(book).some(test)) ||
    (mark !== 'set' && !!author && test(author))
  );
};

const inGoal = (book: BookEntry, goal: Goal, mark: Mark) =>
  goal.kind === 'theme'
    ? book.goals?.some((link) => link.goalId === goal.id)
    : hits(book, mark, (code) => goalHas(goal, code));

/** The books the Shelf shows for these filters, in their sort, and what to offer when none match. */
export function shelfQuery(
  books: BookEntry[],
  filters: ShelfFilters,
  { names, marks }: Context
): ShelfView {
  const { country, continent, mark, year, goal, sort } = filters;
  const name = (code?: string) => (code ? (names[code] ?? '') : '');
  const term = filters.query.trim().toLowerCase();

  const searched = (book: BookEntry) =>
    [
      book.title,
      book.author?.name,
      name(authorCountry(book)),
      ...(book.places ?? []).flatMap((place) => [
        place.name,
        name(place.countryCode ?? undefined),
      ]),
    ]
      .join(' ')
      .toLowerCase()
      .includes(term);

  const list = books.filter(
    (book) =>
      (!country || hits(book, mark, (code) => code === country)) &&
      (!continent ||
        hits(book, mark, (code) => CONTINENT_OF[code] === continent)) &&
      (!year || readYear(book) === year) &&
      (!goal || inGoal(book, goal, mark)) &&
      (!term || searched(book))
  );

  const locale = getLocale();

  if (sort === 'new') list.sort(byReadDate);

  if (sort === 'title')
    list.sort((first, second) =>
      first.title.localeCompare(second.title, locale)
    );

  // by the author's country, then by title within it
  if (sort === 'country')
    list.sort(
      (first, second) =>
        name(authorCountry(first)).localeCompare(
          name(authorCountry(second)),
          locale
        ) || first.title.localeCompare(second.title, locale)
    );

  // a search that names a country with nothing on the shelf is an invitation, not a dead end
  const named = !list.length ? countryFrom(filters.query, names) : null;
  const namedCountry = named && (PARENT[named.code] ?? named.code);

  return {
    list,
    unfiltered: list.length === books.length,
    invite: namedCountry && !marks[namedCountry] ? namedCountry : null,
  };
}

/** the years the shelf has books in, newest first */
export const shelfYears = (books: BookEntry[]) =>
  [...new Set(books.map(readYear).filter(Boolean))].sort().reverse();

/** each year's line: how many books, and how many countries they reached */
export function yearNotes(books: BookEntry[]): Record<string, string> {
  const by: Record<string, { books: number; codes: Set<string> }> = {};

  for (const book of books) {
    const note = (by[readYear(book)] ??= { books: 0, codes: new Set() });

    note.books++;
    for (const code of [authorCountry(book), ...storyCountries(book)])
      if (code) note.codes.add(code);
  }

  return Object.fromEntries(
    Object.entries(by).map(([noteYear, note]) => [
      noteYear,
      `${m.count_book({ count: note.books })} · ${m.count_country({ count: note.codes.size })}`,
    ])
  );
}
