import { createFileRoute } from "@tanstack/react-router";
import TermsPage from "../pages/CompanyPage/content/TermsPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});
