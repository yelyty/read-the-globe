import { createFileRoute } from '@tanstack/react-router';

import ShelfPage from '../pages/shelf/ShelfPage';
import { nextReadsQuery } from '../api/queries';

type ShelfSearch = { country?: string; tab?: 'next'; q?: string };

export const Route = createFileRoute('/app/shelf')({
  validateSearch: (search: Record<string, unknown>): ShelfSearch => ({
    country: typeof search.country === 'string' ? search.country : undefined,
    tab: search.tab === 'next' ? 'next' : undefined,
    q: typeof search.q === 'string' ? search.q : undefined, // a link to the shelf can bring its search
  }),
  loader: async ({ context: { queryClient, readerId } }) => {
    await queryClient.ensureQueryData(nextReadsQuery(readerId));
  },
  component: ShelfPage,
});
