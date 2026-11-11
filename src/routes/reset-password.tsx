import { createFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
});
