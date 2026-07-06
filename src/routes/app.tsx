import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../Dashboard";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
  },
  component: Dashboard,
});
