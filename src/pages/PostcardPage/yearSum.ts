import type { BookEntry, Goal } from '../../types';
import { CONTINENT_OF } from '../../utils/continents';
import { goalName } from '../GoalsPage/goals';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';

// when a book was read; rows saved before read_on fall back to the day they were logged
export const readDate = (b: BookEntry) =>
  b.readOn ?? b.createdAt?.slice(0, 10) ?? '';

// a book's countries, both marks: its author's, then its story's
export const bookCodes = (b: BookEntry) =>
  [
    b.author?.country?.code,
    ...(b.places ?? []).map((p) => p.countryCode),
  ].filter((c): c is string => !!c);

// the years that have books, newest first: one year-end card each
export const bookYears = (books: BookEntry[]) =>
  [
    ...new Set(
      books.map((b) => readDate(b).slice(0, 4)).filter((y) => /^\d{4}$/.test(y))
    ),
  ]
    .sort()
    .reverse();

/* The year-end card's one sentence: "2026: 14 countries, 3 continents, 1 Arctic story." The detail is the theme goal the
   year fed most (on a tie a "Stories set in…" theme, then the goal added first), else how many countries were new. */
export function yearSum(year: string, books: BookEntry[], goals: Goal[]) {
  const yb = books.filter((b) => readDate(b).startsWith(year));
  const codes = [...new Set(yb.flatMap(bookCodes))];
  const continents = new Set(codes.map((c) => CONTINENT_OF[c]).filter(Boolean))
    .size;
  const reads = (g: Goal) => (/^stories set in /i.test(g.name) ? 0 : 1);
  const themed = goals
    .filter((g) => g.kind === 'theme')
    .map((g, i) => ({
      g,
      i,
      n: yb.filter((b) => b.goals?.some((x) => x.goalId === g.id)).length,
    }))
    .filter((x) => x.n)
    .sort((a, b) => b.n - a.n || reads(a.g) - reads(b.g) || a.i - b.i)[0];
  const before = new Set(
    books.filter((b) => readDate(b) < year).flatMap(bookCodes)
  );
  const fresh = codes.filter((c) => !before.has(c)).length;
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
