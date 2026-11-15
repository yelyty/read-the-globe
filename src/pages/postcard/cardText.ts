import type { Goal } from '../../types';
import { m } from '../../paraglide/messages.js';
import { isoDay } from '../../utils/isoDate';
import { lower } from '../../utils/text';
import { goalName } from '../goals/catalogue';
import type { Progress } from '../goals/goalProgress';
import { goalCardName } from './drawGoalCard';
import { KINDS, type Kind, type postcardStats } from './drawPostcard';
import type { yearSum } from './yearSum';

type YearSummary = ReturnType<typeof yearSum>;
type Stats = ReturnType<typeof postcardStats>;

// the card's heading: the reader's first name when there is one
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
  /** the goal's progress, when the card is a goal's */
  progress: Progress | null;
  yearSummary: YearSummary | null;
  kind: Kind;
  stats: Stats;
};

// what the card shows, in words, for a screen reader
export function cardLabel({
  goal,
  progress,
  yearSummary,
  kind,
  stats,
}: CardWords) {
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
}

export const cardFileName = (goal: Goal | null, year: string | null) =>
  goal
    ? goalCardName(goal)
    : year
      ? `read-the-globe-${year}-postcard.png`
      : `read-the-globe-postcard-${isoDay(new Date().toISOString())}.png`;

// the title and line the share sheet sends along with the card
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
