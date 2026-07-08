import { createFileRoute, redirect } from "@tanstack/react-router";
import LandingPage from "../LandingPage/LandingPage";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/app/dashboard" });
    }
  },
  component: LandingPage,
});
