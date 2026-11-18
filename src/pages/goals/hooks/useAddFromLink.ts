import { useEffect, useRef } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

import type { Goal } from '../../../types';
import { CATALOGUE } from '../utils/catalogue';
import type { GoalDraft } from '../utils/goalProgress';

const route = getRouteApi('/app/goals');

type AddFromLink = {
  goals: Goal[];
  add: (draft: GoalDraft) => Promise<void>;
  focusGoal: (name: string) => void;
};

/** ?add=<slug>: a Journal article's "Add this goal" lands here and adds it once, or shows it if it's already there */
export const useAddFromLink = ({ goals, add, focusGoal }: AddFromLink) => {
  const { add: slug } = route.useSearch();
  const navigate = useNavigate();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!slug || handled.current === slug) return;
    handled.current = slug;
    navigate({ to: '/app/goals', search: {}, replace: true });
    const entry = CATALOGUE.find((item) => item.slug === slug);

    if (!entry) return;
    const name = entry.name.toLowerCase();

    if (goals.some((goal) => goal.name.toLowerCase() === name))
      return focusGoal(name);

    add(entry);
  });
};
