import type { Goal } from '../../../types';
import { m } from '../../../paraglide/messages.js';
import { isoDay } from '../../../utils/isoDate';
import { lower } from '../../../utils/text';
import { goalName } from '../../goals/utils/catalogue';
import type { Progress } from '../../goals/utils/goalProgress';
import { goalCardName } from './drawGoalCard';
import { KINDS, type Kind, type postcardStats } from './drawPostcard';
import type { yearSum } from './yearSum';

type YearSummary = ReturnType<typeof yearSum>;
type Stats = ReturnType<typeof postcardStats>;

/**
 * Gets the heading of the card.
 * If the reader has a first name, the heading uses it, for example "Ada’s 2026". If not, the heading uses "My".
 * @param year - The year of a year-end card, or null for an atlas card.
 */
export const cardTitle = (firstName: string, year: string | null) =>
  year
    ? firstName
      ? m.postcard_year_named({ name: firstName, year })
      : m.postcard_my({ what: year })
    : firstName
      ? m.postcard_atlas_named({ name: firstName })
      : m.postcard_atlas_mine();

type CardWords = {
  goal: Goal | null;
  progress: Progress | null;
  yearSummary: YearSummary | null;
  kind: Kind;
  stats: Stats;
};

/**
 * Gets a text that tells what the card shows. Screen readers read this text.
 * For a goal card, the text gives the progress. For a year-end card, it gives the summary of the year.
 * For an atlas card, it gives the type of card and its numbers.
 * If a goal has no progress, the text is for an atlas card.
 */
export const cardLabel = ({
  goal,
  progress,
  yearSummary,
  kind,
  stats,
}: CardWords) => {
  if (goal && progress) {
    const of =
      goal.kind === 'theme' ? m.postcard_of_books : m.postcard_of_countries;

    return m.postcard_label_goal({
      goal: goalName(goal.name),
      progress: of({ done: progress.done, count: progress.total }),
    });
  }

  if (yearSummary)
    return m.postcard_label_year({
      line: yearSummary.line,
      books: m.count_book({ count: yearSummary.books.length }),
    });

  return m.postcard_label_atlas({
    kind: lower(KINDS[kind].name()),
    countries: stats.countries,
    books: m.count_book({ count: stats.books }),
    continents: m.count_continent({ count: stats.continents }),
  });
};

/**
 * Gets the file name for the saved card.
 * A goal card uses the name of the goal. A year-end card uses the year. An atlas card uses the date of today.
 */
export const cardFileName = (goal: Goal | null, year: string | null) =>
  goal
    ? goalCardName(goal)
    : year
      ? `read-the-globe-${year}-postcard.png`
      : `read-the-globe-postcard-${isoDay(new Date().toISOString())}.png`;

/**
 * Gets the title and the text that the share sheet sends with the card.
 * The text tells about the goal, the year, or the number of countries on the atlas card.
 */
export const cardShare = ({
  goal,
  yearSummary,
  kind,
  stats,
}: Omit<CardWords, 'progress'>) => ({
  title: goal
    ? m.postcard_share_title_goal({ goal: goalName(goal.name) })
    : m.postcard_share_title(),
  text: goal
    ? m.postcard_share_goal({ goal: goalName(goal.name) })
    : yearSummary
      ? m.postcard_my({ what: yearSummary.line })
      : KINDS[kind].share(stats.countries),
});
