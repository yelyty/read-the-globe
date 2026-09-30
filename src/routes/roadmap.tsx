import { createFileRoute } from "@tanstack/react-router";
import RoadMapPage from "../pages/CompanyPage/content/RoadMapPage";

export const Route = createFileRoute("/roadmap")({
  component: RoadMapPage,
});
