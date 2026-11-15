import type { BookEntry, Goal } from '../../../types';
import type { Marks } from '../../../utils/atlasMarks';
import { CONTINENT_OF } from '../../../utils/continents';
import { MAP_CODES } from '../../../utils/world';

/* How far the reader's books go into a goal, and which countries a goal takes in. */

export type GoalDraft = Pick<
  Goal,
  'kind' | 'name' | 'continent' | 'countryCodes' | 'target'
>;

export type Progress = {
  /** books counted (a theme), or countries marked (a place goal) */
  done: number;
  /** what reaching it takes */
  total: number;
  /** a place goal's countries, marked or not; [] for a theme */
  all: string[];
  /** the ones already marked */
  reached: string[];
};

/** How far the reader's books go into a goal. A theme counts the books ticked toward it; a region counts the countries
    on the map in that continent, a list goal its own countries, and either is reached when every one is marked. */
export function goalProgress(
  goal: GoalDraft & { id?: number },
  marks: Marks,
  books: BookEntry[]
): Progress {
  if (goal.kind === 'theme') {
    const done = books.filter((book) =>
      book.goals?.some((link) => link.goalId === goal.id)
    ).length;

    return { done, total: goal.target ?? 1, all: [], reached: [] };
  }

  const all =
    goal.kind === 'region'
      ? MAP_CODES.filter((code) => CONTINENT_OF[code] === goal.continent)
      : (goal.countryCodes ?? []);

  const reached = all.filter((code) => marks[code]);

  return { done: reached.length, total: all.length, all, reached };
}

export const isDone = (progress: Progress) =>
  progress.total > 0 && progress.done >= progress.total;

/** a place goal takes in this country: its continent, or its list */
export const goalHas = (goal: Goal, code: string) =>
  goal.kind === 'region'
    ? CONTINENT_OF[code] === goal.continent
    : goal.kind === 'countries' && !!goal.countryCodes?.includes(code);
