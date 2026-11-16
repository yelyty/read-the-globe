import { QueryClient } from '@tanstack/react-query';

// a route's loader fills the cache just before its page shows; for this long the page reads it without asking again
const FRESH_MS = 60_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    // a load that fails is tried once more, then the route shows its error view
    queries: { staleTime: FRESH_MS, retry: 1 },
  },
});
