import type { BookEntry, Goal } from '../../../types';
import { addGoal, deleteGoal, restoreGoal } from '../../../api/goals/goals';
import { useRefresh } from '../../../hooks/useReader';
import { useStatus } from '../../../hooks/useStatus';
import { useUndo } from '../../../hooks/useUndo';
import { m } from '../../../paraglide/messages.js';
import * as styles from '../GoalsPage.css';
import { goalName } from '../utils/catalogue';
import type { GoalDraft } from '../utils/goalProgress';

type GoalActions = {
  books: BookEntry[];
  /** the goals as listed, so focus can move to the row that takes a removed one's place */
  sorted: Goal[];
  full: boolean;
  focusGoal: (name: string) => void;
};

/** Adding, saving and removing goals: each says what happened on the status line and reloads the goals. */
export function useGoalActions({
  books,
  sorted,
  full,
  focusGoal,
}: GoalActions) {
  const status = useStatus();
  const offerUndo = useUndo();
  const refresh = useRefresh();

  const say = (text: string) => status.show({ text });

  // a goal saved: say so, focus it once it's listed (when named), and reload
  const saved = async (message: string, focus?: string) => {
    say(message);
    if (focus) focusGoal(focus);
    await refresh('goals', 'books');
  };

  const add = async (draft: GoalDraft) => {
    if (full) return;
    const problem = await addGoal(draft);

    if (problem) return say(problem);
    saved(m.goals_added({ goal: goalName(draft.name) }), draft.name);
  };

  const remove = async (goal: Goal) => {
    const ticked = books
      .filter((book) => book.goals.some((link) => link.goalId === goal.id))
      .map((book) => book.id);

    const at = sorted.indexOf(goal);
    const problem = await deleteGoal(goal.id);

    if (problem) return say(problem);
    await refresh('goals', 'books');
    // focus goes to the row now in its place, or to the suggestions when it was the last one
    const left = document.querySelectorAll<HTMLElement>('[data-remove-goal]');

    (
      left[Math.min(at, left.length - 1)] ??
      document.querySelector<HTMLElement>(`.${styles.sugg} > summary`)
    )?.focus();

    offerUndo({
      said: ticked.length
        ? m.goals_removed_unticked({
            goal: goalName(goal.name),
            books: m.count_book({ count: ticked.length }),
          })
        : m.goals_removed({ goal: goalName(goal.name) }),
      // back, it takes focus again once its row shows up
      undo: async () => {
        const undoProblem = await restoreGoal(goal, ticked);

        if (!undoProblem) focusGoal(goal.name);

        return undoProblem;
      },
      undone: m.goals_back({ goal: goalName(goal.name) }),
    });
  };

  return { saved, add, remove };
}
