import { queryOptions } from '@tanstack/react-query';

import { loadCountries } from '../utils/countryStamps';
import { getCountryNames } from '../utils/countryNames';
import { worldShapes } from '../utils/world';
import getBooks from './getBooks';
import { getGoals } from './goals/goals';
import { getWorlds } from './worlds/worlds';
import { getNextReads } from './nextReads/nextReads';
import { getProfile } from './Profile/getProfile';

/* What the app reads, as TanStack Query options: route loaders fill the cache, pages read it, changes refresh it.
   A reader's own data sits under readerKey, so signing out can drop all of it at once. */

/** the part of a reader's data a change touched, for refreshing just that */
export type ReaderData = 'books' | 'goals' | 'worlds' | 'nextReads' | 'profile';

export const readerKey = (readerId: string) => ['reader', readerId] as const;

export const readerDataKey = (readerId: string, part: ReaderData) =>
  [...readerKey(readerId), part] as const;

export const booksQuery = (readerId: string) =>
  queryOptions({
    queryKey: readerDataKey(readerId, 'books'),
    queryFn: () => getBooks(readerId),
  });

export const goalsQuery = (readerId: string) =>
  queryOptions({
    queryKey: readerDataKey(readerId, 'goals'),
    queryFn: () => getGoals(readerId),
  });

export const worldsQuery = (readerId: string) =>
  queryOptions({
    queryKey: readerDataKey(readerId, 'worlds'),
    queryFn: () => getWorlds(readerId),
  });

export const nextReadsQuery = (readerId: string) =>
  queryOptions({
    queryKey: readerDataKey(readerId, 'nextReads'),
    queryFn: () => getNextReads(readerId),
  });

export const profileQuery = (readerId: string) =>
  queryOptions({
    queryKey: readerDataKey(readerId, 'profile'),
    queryFn: () => getProfile(readerId),
  });

// the map file never changes while the page is open; a new language reloads the page
export const countriesQuery = queryOptions({
  queryKey: ['countries'],
  queryFn: loadCountries,
  staleTime: Infinity,
});

export const countryNamesQuery = queryOptions({
  queryKey: ['countryNames'],
  queryFn: getCountryNames,
  staleTime: Infinity,
});

export const worldShapesQuery = queryOptions({
  queryKey: ['worldShapes'],
  queryFn: worldShapes,
  staleTime: Infinity,
});
