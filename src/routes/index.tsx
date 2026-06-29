import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../auth-context";
import LandingPage from "../LandingPage";
import Dashboard from "../Dashboard";

const Home = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
};

export const Route = createFileRoute("/")({
  component: Home,
});
