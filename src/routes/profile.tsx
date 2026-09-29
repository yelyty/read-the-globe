import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfileSettings from "../ProfileSettings";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
  },
  component: ProfileSettings,
});
