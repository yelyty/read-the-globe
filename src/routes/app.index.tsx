import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../pages/HomePage/HomePage";

export const Route = createFileRoute("/app/")({
  component: HomePage,
});
