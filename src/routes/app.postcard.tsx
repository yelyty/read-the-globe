import { createFileRoute } from '@tanstack/react-router';

import PostcardPage from '../pages/postcard/PostcardPage';
import { profileQuery } from '../api/queries';

type PostcardSearch = { goal?: number; year?: string };

export const Route = createFileRoute('/app/postcard')({
  // ?goal=<id>: a reached goal's Postcard link; ?year=<yyyy>: that year's card
  validateSearch: (search: Record<string, unknown>): PostcardSearch => ({
    goal: Number.isInteger(search.goal) ? (search.goal as number) : undefined,
    // the router reads ?year=2026 as a number
    year: /^\d{4}$/.test(String(search.year as number | string | undefined))
      ? String(search.year)
      : undefined,
  }),
  loader: async ({ context: { queryClient, readerId } }) => {
    await queryClient.ensureQueryData(profileQuery(readerId));
  },
  component: () => <PostcardPage />,
});
