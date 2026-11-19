import { useState } from 'react';

import type { Goal } from '../../../types';
import { m } from '../../../paraglide/messages.js';
import { goalName } from '../utils/catalogue';

type Saved = (message: string, focus?: string) => Promise<void>;

/** The page's two dialogs: a goal being made or edited, and a goal whose books are being chosen. */
export const useGoalDialogs = (saved: Saved) => {
  const [editing, setEditing] = useState<Goal | 'new' | null>(null);
  const [choosing, setChoosing] = useState<Goal | null>(null);

  const handleNewGoal = () => setEditing('new');
  const handleEdit = (goal: Goal) => () => setEditing(goal);
  const handleChooseBooks = (goal: Goal) => () => setChoosing(goal);
  const handleEditClose = () => setEditing(null);
  const handleChooseClose = () => setChoosing(null);

  // the line said after a save names the goal; a new one is also scrolled to
  const handleGoalSaved = (savedName: string) =>
    saved(
      (editing === 'new' ? m.goals_added : m.goals_saved)({
        goal: goalName(savedName),
      }),
      savedName
    );

  const handleBooksSaved = (count: number) =>
    choosing &&
    saved(m.goals_books_counted({ count, goal: goalName(choosing.name) }));

  return {
    editing,
    choosing,
    handleNewGoal,
    handleEdit,
    handleChooseBooks,
    handleEditClose,
    handleChooseClose,
    handleGoalSaved,
    handleBooksSaved,
  };
};
