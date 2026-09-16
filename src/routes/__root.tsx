import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextValue } from "../auth-context";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
