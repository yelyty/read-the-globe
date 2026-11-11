import { createFileRoute } from '@tanstack/react-router';
import ShelfPage from '../pages/ShelfPage/ShelfPage';
import { getNextReads } from '../api/nextReads/nextReads';

type ShelfSearch = { country?: string; tab?: 'next'; q?: string };

export const Route = createFileRoute('/app/shelf')({
  validateSearch: (search: Record<string, unknown>): ShelfSearch => ({
    country: typeof search.country === 'string' ? search.country : undefined,
    tab: search.tab === 'next' ? 'next' : undefined,
    q: typeof search.q === 'string' ? search.q : undefined, // a link to the shelf can bring its search
  }),
  loader: ({ context }) => getNextReads(context.auth.user!.id),
  component: ShelfPage,
});
