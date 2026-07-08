import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextValue } from "../auth-context";
import { themeClass } from "../theme.css";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={themeClass}>
      <Outlet />
    </div>
  );
}
