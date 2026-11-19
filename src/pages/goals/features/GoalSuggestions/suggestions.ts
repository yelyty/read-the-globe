import type { Goal, GoalKind } from '../../../../types';
import {
  CATALOGUE,
  KIND_GROUP,
  type CatalogueGoal,
} from '../../utils/catalogue';
import type { Progress } from '../../utils/goalProgress';

// the suggestions offered: the best few, then one of each kind of goal if it isn't there yet
const TOP_SUGGESTIONS = 4;

type Offer = { c: CatalogueGoal; i: number; p: Progress; score: number };

/**
 * Gets the catalogue goals to suggest. Goals the reader already has are not suggested.
 * Up to 4 goals that the books of the reader are already into come first, plus one goal of each kind.
 * The other goals are grouped by kind under More goals. If the reader has no goals yet, the best one is picked out.
 * @param progress - Gets how far the books of the reader go into a goal.
 * @returns The pick, the top goals, the other goals, and the other goals grouped by kind.
 */
export const suggestGoals = (
  goals: Goal[],
  progress: (goal: CatalogueGoal) => Progress
) => {
  const have = new Set(goals.map((goal) => goal.name.toLowerCase()));

  const left: Offer[] = CATALOGUE.filter(
    (entry) => !have.has(entry.name.toLowerCase())
  ).map((entry, i) => {
    const prog = progress(entry);

    return {
      c: entry,
      i,
      p: prog,
      score: entry.kind === 'theme' ? -1 : prog.done / prog.total,
    };
  });

  const byScore = (first: Offer, second: Offer) =>
    second.score - first.score || first.i - second.i;

  const underway = (option: Offer) => option.score > 0 && option.score < 1;

  const pick = !goals.length
    ? left.filter(underway).sort(byScore)[0]
    : undefined;

  const offered = left.filter((option) => option !== pick);
  const top = offered.filter(underway).sort(byScore).slice(0, TOP_SUGGESTIONS);

  for (const kind of Object.keys(KIND_GROUP) as GoalKind[]) {
    const extra = offered.find(
      (option) => option.c.kind === kind && !top.includes(option)
    );

    if (
      extra &&
      top.length < TOP_SUGGESTIONS &&
      !top.some((option) => option.c.kind === kind)
    )
      top.push(extra);
  }

  const rest = offered.filter((option) => !top.includes(option));

  // a kind with nothing left to offer isn't shown
  const groups = (Object.keys(KIND_GROUP) as GoalKind[])
    .map((kind) => ({
      kind,
      items: rest.filter((option) => option.c.kind === kind),
    }))
    .filter((group) => group.items.length);

  return { pick, top, rest, groups };
};
