import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextValue } from "../auth/auth-context";
import CompanyPage from "../pages/CompanyPage/CompanyPage";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: () => (
    // TODO: Redesign 404 page
    <CompanyPage title="Page not found" description="This page does not exist.">
      <h1>Page not found </h1>
    </CompanyPage>
  ),
});
