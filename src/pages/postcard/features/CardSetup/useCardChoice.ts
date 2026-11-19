import { useEffect, useMemo, useState } from 'react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

import type { BookEntry, Goal, Profile } from '../../../../types';
import type { SavedPostcard } from '../../../../api/profile/profile';
import { atlasMarks } from '../../../../utils/atlasMarks';
import { firstName } from '../../../../utils/firstName';
import { goalProgress } from '../../../goals/utils/goalProgress';
import { readOptions, type CardOptions } from '../../utils/cardOptions';
import { cardLabel, cardTitle } from '../../utils/cardText';
import { KINDS, postcardStats } from '../../utils/drawPostcard';
import { bookYears, yearSum } from '../../utils/yearSum';
import { useSavedSetup } from './useSavedSetup';

const route = getRouteApi('/app/postcard');

type CardChoice = {
  books: BookEntry[];
  goals: Goal[];
  profile: (Profile & { postcard: SavedPostcard }) | null;
  user: { id: string; signUpName: string | null } | null;
};

/**
 * Gets the card that the Postcard page shows, and the data for that card.
 * The saved set-up is the start point. A link with ?goal= or ?year= changes the card to that goal or year.
 * After that, the hook removes the search parameters from the address.
 * The hook saves the set-up when it changes.
 * @returns The set-up and a function to change it, the years and reached goals that have a card,
 *   and the title, numbers, color, and screen-reader label of the card.
 */
export const useCardChoice = ({ books, goals, profile, user }: CardChoice) => {
  const search = route.useSearch();
  const navigate = useNavigate();

  const [options, setOptions] = useState<CardOptions>(() => ({
    ...readOptions(profile?.postcard ?? null),
    ...(search.goal !== undefined && { goal: search.goal, year: null }),
    ...(search.year && { year: search.year, goal: null }),
  }));

  // the link's choice is in the options now; the address goes back to plain /app/postcard
  useEffect(() => {
    if (search.goal !== undefined || search.year)
      navigate({ to: '/app/postcard', search: {}, replace: true });
  }, [search, navigate]);

  useSavedSetup(options, user?.id);

  const change = (next: Partial<CardOptions>) =>
    setOptions((prev) => ({ ...prev, ...next }));

  const marks = useMemo(() => atlasMarks(books), [books]);

  const counts = {
    authors: postcardStats(books, marks, KINDS.authors).countries,
    settings: postcardStats(books, marks, KINDS.settings).countries,
  };

  const stats = postcardStats(books, marks, KINDS[options.kind]);
  const first = firstName(profile?.displayName ?? user?.signUpName);

  const years = bookYears(books);
  const reached = goals.filter((candidate) => candidate.reachedOn);
  const goal = reached.find((item) => item.id === options.goal) ?? null;

  const year =
    !goal && options.year && years.includes(options.year) ? options.year : null;

  const yearSummary = useMemo(
    () => (year ? yearSum(year, books, goals) : null),
    [year, books, goals]
  );

  const title = cardTitle(first, year);
  const color = options.color ?? (year ? 'green' : KINDS[options.kind].color);

  const label = cardLabel({
    goal,
    progress: goal && goalProgress(goal, marks, books),
    yearSummary,
    kind: options.kind,
    stats,
  });

  return {
    options,
    change,
    marks,
    counts,
    stats,
    firstName: first,
    years,
    reached,
    goal,
    year,
    yearSummary,
    title,
    color,
    label,
  };
};
