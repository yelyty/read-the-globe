import { createFileRoute } from "@tanstack/react-router";
import GoalsPage from "../pages/GoalsPage/GoalsPage";

export const Route = createFileRoute("/app/goals")({
  component: () => <GoalsPage />,
});
