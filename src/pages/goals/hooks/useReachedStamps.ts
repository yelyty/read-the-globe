import { useEffect, useState } from 'react';

import type { BookEntry, Goal } from '../../../types';
import { useRefresh } from '../../../hooks/useReader';
import { markReached } from '../../../api/goals/goals';
import { atlasMarks } from '../../../utils/atlasMarks';
import { prefersReducedMotion } from '../../../utils/motion';
import { localToday } from '../../../utils/readDate';
import { goalProgress, isDone } from '../utils/goalProgress';

/**
 * Marks a goal as reached the first time it is seen full, and removes the mark if a book is removed.
 * @returns The ids of the goals that were reached while the reader looked. Each one plays the arrival once.
 */
export function useReachedStamps(goals: Goal[], books: BookEntry[]) {
  const refresh = useRefresh();
  const [arriving, setArriving] = useState<number[]>([]);

  useEffect(() => {
    const changes = goals
      .map((goal) => ({
        g: goal,
        done: isDone(goalProgress(goal, atlasMarks(books), books)),
      }))
      .filter(({ g, done }) => done !== !!g.reachedOn);

    if (!changes.length) return;

    Promise.all(
      changes.map(({ g, done }) =>
        markReached(g.id, done ? localToday() : null)
      )
    ).then((problems) => {
      if (!problems.every((problem) => !problem)) return;
      if (!prefersReducedMotion())
        setArriving((prev) => [
          ...prev,
          ...changes
            .filter((change) => change.done)
            .map((change) => change.g.id),
        ]);
      refresh('goals');
    });
  }, [goals, books, refresh]);

  return arriving;
}
