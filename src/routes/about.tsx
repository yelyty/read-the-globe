import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "../pages/CompanyPage/content/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
