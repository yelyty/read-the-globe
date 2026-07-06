import { createFileRoute } from "@tanstack/react-router";
import ProfileSettings from "../ProfileSettings";

export const Route = createFileRoute("/profile")({
  component: ProfileSettings,
});
