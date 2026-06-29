import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./auth-context";
import { router } from "./router";

export function App() {
  const auth = useAuth();
  if (auth.loading) return null;
  return <RouterProvider router={router} context={{ auth }} />;
}
