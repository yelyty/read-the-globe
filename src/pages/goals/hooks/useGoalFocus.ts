import { useCallback, useEffect, useRef } from 'react';

import type { Goal } from '../../../types';
import { prefersReducedMotion } from '../../../utils/motion';

/** Focuses a goal by name once its row shows up: one just added, or one back from Undo.
    `ready` is false while the page still waits to draw its rows. */
export function useGoalFocus(goals: Goal[], ready: boolean) {
  const focusName = useRef<string | null>(null);

  useEffect(() => {
    const focused = goals.find(
      (goal) => goal.name.toLowerCase() === focusName.current
    );

    const heading =
      focused &&
      document.querySelector<HTMLElement>(`[data-goal="${focused.id}"] h3`);

    if (!heading) return;
    focusName.current = null;

    heading.scrollIntoView({
      block: 'center',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });

    heading.focus({ preventScroll: true });
  }, [goals, ready]);

  return useCallback((name: string) => {
    focusName.current = name.trim().toLowerCase();
  }, []);
}
