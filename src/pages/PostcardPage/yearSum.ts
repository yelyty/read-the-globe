import type { BookEntry, Goal } from '../../types';
import { CONTINENT_OF } from '../../utils/continents';
import { goalName } from '../GoalsPage/goals';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';

// when a book was read; rows saved before read_on fall back to the day they were logged
export const readDate = (book: BookEntry) =>
  book.readOn ?? book.createdAt?.slice(0, 10) ?? '';

// a book's countries, both marks: its author's, then its story's
export const bookCodes = (book: BookEntry) =>
  [
    book.author?.country?.code,
    ...(book.places ?? []).map((place) => place.countryCode),
  ].filter((code): code is string => !!code);

// the years that have books, newest first: one year-end card each
export const bookYears = (books: BookEntry[]) =>
  [
    ...new Set(
      books
        .map((book) => readDate(book).slice(0, 4))
        .filter((year) => /^\d{4}$/.test(year))
    ),
  ]
    .sort()
    .reverse();

/* The year-end card's one sentence: "2026: 14 countries, 3 continents, 1 Arctic story." The detail is the theme goal the
   year fed most (on a tie a "Stories set in…" theme, then the goal added first), else how many countries were new. */
export function yearSum(year: string, books: BookEntry[], goals: Goal[]) {
  const yb = books.filter((book) => readDate(book).startsWith(year));
  const codes = [...new Set(yb.flatMap(bookCodes))];

  const continents = new Set(
    codes.map((code) => CONTINENT_OF[code]).filter(Boolean)
  ).size;

  const reads = (goal: Goal) => (/^stories set in /i.test(goal.name) ? 0 : 1);

  const themed = goals
    .filter((goal) => goal.kind === 'theme')
    .map((goal, i) => ({
      g: goal,
      i,
      n: yb.filter((book) =>
        book.goals?.some((bookGoal) => bookGoal.goalId === goal.id)
      ).length,
    }))
    .filter((entry) => entry.n)
    .sort(
      (first, second) =>
        second.n - first.n ||
        reads(first.g) - reads(second.g) ||
        first.i - second.i
    )[0];

  const before = new Set(
    books.filter((book) => readDate(book) < year).flatMap(bookCodes)
  );

  const fresh = codes.filter((code) => !before.has(code)).length;
  let extra = '';

  if (themed) {
    // "1 Arctic story" is English word order; Czech and Ukrainian say "1 book for <goal>"
    const arctic =
      getLocale() === 'en' &&
      themed.g.name.match(/^stories set in (?:the )?(.+)$/i);

    extra = arctic
      ? `${themed.n} ${arctic[1]} ${themed.n === 1 ? 'story' : 'stories'}`
      : m.postcard_books_for_goal({
          books: m.count_book({ count: themed.n }),
          goal: goalName(themed.g.name),
        });
  } else if (fresh && fresh < codes.length)
    extra = m.postcard_new_to_atlas({ n: fresh });
  // the same shape in all three languages: "2026: 14 zemí, 3 kontinenty, …"
  const line = `${year}: ${m.count_country({ count: codes.length })}, ${m.count_continent({ count: continents })}${extra ? `, ${extra}` : ''}.`;

  return { books: yb, codes, continents, line };
}
