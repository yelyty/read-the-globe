import { useCallback } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import type { NextRead } from '../types';
import {
  booksQuery,
  goalsQuery,
  nextReadsQuery,
  profileQuery,
  readerDataKey,
  readerKey,
  worldsQuery,
  type ReaderData,
} from '../api/queries';

const app = getRouteApi('/app');

/** the signed-in reader, as /app saw them when it loaded: still there in the moment between signing out and leaving */
export const useReaderId = () =>
  app.useRouteContext({ select: (context) => context.readerId });

/**
 * Gets the books of the signed-in reader. The loader of /app puts them in the cache before a page shows.
 */
export const useBooks = () => {
  const readerId = useReaderId();

  return useSuspenseQuery(booksQuery(readerId)).data;
};

/**
 * Gets the goals of the signed-in reader. The loader of /app puts them in the cache before a page shows.
 */
export const useGoals = () => {
  const readerId = useReaderId();

  return useSuspenseQuery(goalsQuery(readerId)).data;
};

/**
 * Gets the saved worlds of the signed-in reader. The loader of /app puts them in the cache before a page shows.
 */
export const useWorlds = () => {
  const readerId = useReaderId();

  return useSuspenseQuery(worldsQuery(readerId)).data;
};

/**
 * Gets the profile of the signed-in reader. The loader of the Postcard page puts it in the cache.
 */
export const useProfile = () => {
  const readerId = useReaderId();

  return useSuspenseQuery(profileQuery(readerId)).data;
};

/**
 * Gets the next reads of the signed-in reader. The loader of the Shelf page puts them in the cache.
 * @returns The list, if it failed to load, and `setItems`, which changes the list in the cache without loading it again.
 */
export const useNextReads = () => {
  const readerId = useReaderId();
  const queryClient = useQueryClient();
  const { items, failed } = useSuspenseQuery(nextReadsQuery(readerId)).data;

  const setItems = useCallback(
    (update: (list: NextRead[]) => NextRead[]) =>
      queryClient.setQueryData(
        nextReadsQuery(readerId).queryKey,
        (was) => was && { ...was, items: update(was.items) }
      ),
    [queryClient, readerId]
  );

  return { items, failed, setItems };
};

/** Reloads the parts of the reader's data a change touched; with none named, all of it. Resolves once they're in. */
export const useRefresh = () => {
  const readerId = useReaderId();
  const queryClient = useQueryClient();

  return useCallback(
    async (...parts: ReaderData[]) => {
      const keys = parts.length
        ? parts.map((part) => readerDataKey(readerId, part))
        : [readerKey(readerId)];

      await Promise.all(
        keys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
      );
    },
    [queryClient, readerId]
  );
};
