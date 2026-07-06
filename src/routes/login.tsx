import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../LoginForm";

export const Route = createFileRoute("/login")({
  component: LoginForm,
});
