import { createFileRoute } from "@tanstack/react-router";
import PostcardPage from "../pages/PostcardPage/PostcardPage";

export const Route = createFileRoute("/app/postcard")({
  component: () => <PostcardPage />,
});
