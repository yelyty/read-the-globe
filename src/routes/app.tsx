import { createFileRoute, redirect } from '@tanstack/react-router';
import getBooks from '../api/getBooks';
import AppLayout from '../components/AppLayout/AppLayout';
import { getGoals } from '../api/goals/goals';
import { getWorlds } from '../api/worlds/worlds';
import { m } from '../paraglide/messages.js';

type AppSearch = {
  log?: true;
  /** Log a book with a place in this country filled in (on the Shelf it is also the country filter) */
  country?: string;
  /** Log a book with a place in this imagined world filled in */
  world?: string;
  edit?: string;
  next?: string;
};

export const Route = createFileRoute('/app')({
  validateSearch: (search: Record<string, unknown>): AppSearch => ({
    log: search.log === true ? true : undefined,
    edit: typeof search.edit === 'string' ? search.edit : undefined,
    next: typeof search.next === 'string' ? search.next : undefined,
    country: typeof search.country === 'string' ? search.country : undefined,
    world: typeof search.world === 'string' ? search.world : undefined,
  }),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/', search: { redirect: location.href } });
    }
  },
  loader: async ({ context }) => {
    const userId = context.auth.user!.id;

    const [books, goals, worlds] = await Promise.all([
      getBooks(userId),
      getGoals(userId),
      getWorlds(userId),
    ]);

    return { books, goals, worlds };
  },
  //   TODO: Create error component
  errorComponent: () => <p>{m.common_try_again()}</p>,
  component: AppLayout,
});
