import { createFileRoute, redirect } from '@tanstack/react-router';

import AppLayout from '../layout/AppLayout/AppLayout';
import { booksQuery, goalsQuery, worldsQuery } from '../api/queries';
import { searchId } from '../utils/searchId';
import { m } from '../paraglide/messages.js';

type AppSearch = {
  log?: true;
  /** Log a book with a place in this country filled in (on the Shelf it is also the country filter) */
  country?: string;
  /** Log a book with a place in this imagined world filled in */
  world?: string;
  edit?: number;
  next?: number;
};

export const Route = createFileRoute('/app')({
  validateSearch: (search: Record<string, unknown>): AppSearch => ({
    log: search.log === true ? true : undefined,
    edit: searchId(search.edit),
    next: searchId(search.next),
    country: typeof search.country === 'string' ? search.country : undefined,
    world: typeof search.world === 'string' ? search.world : undefined,
  }),
  beforeLoad: ({ context, location }) => {
    const { user } = context.auth;

    if (!user) {
      throw redirect({ to: '/', search: { redirect: location.href } });
    }

    return { readerId: user.id };
  },
  // every /app page reads these (useBooks, useGoals, useWorlds); they're in the cache before it shows
  loader: async ({ context: { queryClient, readerId } }) => {
    await Promise.all([
      queryClient.ensureQueryData(booksQuery(readerId)),
      queryClient.ensureQueryData(goalsQuery(readerId)),
      queryClient.ensureQueryData(worldsQuery(readerId)),
    ]);
  },
  //   TODO: Create error component
  errorComponent: () => <p>{m.common_try_again()}</p>,
  component: AppLayout,
});
