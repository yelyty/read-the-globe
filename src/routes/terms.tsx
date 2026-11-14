import { createFileRoute } from '@tanstack/react-router';
import TermsPage from '../pages/company/content/TermsPage';

export const Route = createFileRoute('/terms')({
  component: TermsPage,
});
