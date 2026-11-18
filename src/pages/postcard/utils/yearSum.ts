import type { BookEntry, Goal } from '../../../types';
import { CONTINENT_OF } from '../../../utils/continents';
import { m } from '../../../paraglide/messages.js';
import { getLocale } from '../../../paraglide/runtime.js';
import { bookCountries } from '../../../utils/book';
import { readDate, readYear } from '../../../utils/readDate';
import { goalName } from '../../goals/utils/catalogue';

/**
 * Gets the years that have books, with the newest year first.
 * Each of these years gets one year-end card. Books without a year are not included.
 */
export const bookYears = (books: BookEntry[]) =>
  [...new Set(books.map(readYear).filter((year) => /^\d{4}$/.test(year)))]
    .sort()
    .reverse();

/**
 * Makes the one-sentence summary of a year-end card, for example "2026: 14 countries, 3 continents, 1 Arctic story."
 * The detail at the end is the theme goal that got the most books in that year.
 * If two goals have the same number of books, a "Stories set in…" goal wins. Then the goal that was added first wins.
 * If no theme goal got books, the detail is the number of countries that are new to the atlas.
 * This detail shows only if some of the countries are not new.
 * @returns The books of the year, their country codes, the number of continents, and the sentence.
 */
export function yearSum(year: string, books: BookEntry[], goals: Goal[]) {
  const yb = books.filter((book) => readDate(book).startsWith(year));
  const codes = [...new Set(yb.flatMap(bookCountries))];

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
    books.filter((book) => readDate(book) < year).flatMap(bookCountries)
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
