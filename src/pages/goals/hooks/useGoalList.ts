import { useMemo } from 'react';

import type { BookEntry, Goal } from '../../../types';
import { atlasMarks } from '../../../utils/atlasMarks';
import { MAX_GOALS } from '../utils/catalogue';
import { goalProgress, isDone, type GoalDraft } from '../utils/goalProgress';

/** the reader's goals as the page lists them: open ones first, reached ones after, with how far each has come */
export function useGoalList(goals: Goal[], books: BookEntry[]) {
  return useMemo(() => {
    const marks = atlasMarks(books);

    const progress = (draft: GoalDraft & { id?: number }) =>
      goalProgress(draft, marks, books);

    const open = goals.filter((goal) => !isDone(progress(goal)));
    const reached = goals.filter((goal) => isDone(progress(goal)));

    return {
      marks,
      progress,
      sorted: [...open, ...reached],
      reachedCount: reached.length,
      full: goals.length >= MAX_GOALS,
    };
  }, [goals, books]);
}
