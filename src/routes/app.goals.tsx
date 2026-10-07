import { createFileRoute } from "@tanstack/react-router";
import PlaceholderPage from "../pages/PlaceholderPage/PlaceholderPage";

export const Route = createFileRoute("/app/goals")({
  component: () => <PlaceholderPage title="Goals" />,
});
