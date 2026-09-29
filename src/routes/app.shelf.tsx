import { createFileRoute } from "@tanstack/react-router";
import ShelfPage from "../pages/ShelfPage/ShelfPage";

export const Route = createFileRoute("/app/shelf")({
  validateSearch: (search: Record<string, unknown>): { country?: string } => ({
    country: typeof search.country === "string" ? search.country : undefined,
  }),
  component: ShelfPage,
});
