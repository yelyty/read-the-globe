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

// /app's loader has these in the cache before any of its pages show
export function useBooks() {
  const readerId = useReaderId();

  return useSuspenseQuery(booksQuery(readerId)).data;
}

export function useGoals() {
  const readerId = useReaderId();

  return useSuspenseQuery(goalsQuery(readerId)).data;
}

export function useWorlds() {
  const readerId = useReaderId();

  return useSuspenseQuery(worldsQuery(readerId)).data;
}

// the Postcard's loader has this one in the cache
export function useProfile() {
  const readerId = useReaderId();

  return useSuspenseQuery(profileQuery(readerId)).data;
}

// the Shelf's loader has this one in the cache; setItems changes the cached list in place, without asking again
export function useNextReads() {
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
}

/** Reloads the parts of the reader's data a change touched; with none named, all of it. Resolves once they're in. */
export function useRefresh() {
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
}
