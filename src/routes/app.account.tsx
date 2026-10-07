import { createFileRoute } from "@tanstack/react-router";
import PlaceholderPage from "../pages/PlaceholderPage/PlaceholderPage";

export const Route = createFileRoute("/app/account")({
  component: () => <PlaceholderPage title="Account" />,
});
