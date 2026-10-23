import { createFileRoute, redirect } from "@tanstack/react-router";
import getBooks from "../api/getBooks";
import AppLayout from "../components/AppLayout/AppLayout";
import { getGoals } from "../api/goals/goals";

type AppSearch = {
  log?: true;
  country?: string;
};

export const Route = createFileRoute("/app")({
  validateSearch: (search: Record<string, unknown>): AppSearch => ({
    log: search.log === true ? true : undefined,
    country: typeof search.country === "string" ? search.country : undefined,
  }),
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
  },
  loader: async ({ context }) => {
    const userId = context.auth.user!.id;
    const [books, goals] = await Promise.all([
      getBooks(userId),
      getGoals(userId),
    ]);
    return { books, goals };
  },
  //   TODO: Create error component
  errorComponent: () => <p>Error</p>,
  component: AppLayout,
});
