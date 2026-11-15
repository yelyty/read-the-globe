import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';

import type { BookEntry, Goal } from '../../../types';
import { markReached } from '../../../api/goals/goals';
import { atlasMarks } from '../../../utils/atlasMarks';
import { prefersReducedMotion } from '../../../utils/motion';
import { localToday } from '../../../utils/readDate';
import { goalProgress, isDone } from '../utils/goalProgress';

// A goal is stamped reached the first time it is seen full, and loses the stamp if a book is removed.
// Returns the goals that crossed their flag while the reader looked: each gets the arrival once.
export function useReachedStamps(goals: Goal[], books: BookEntry[]) {
  const router = useRouter();
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
      router.invalidate();
    });
  }, [goals, books, router]);

  return arriving;
}
