import { createFileRoute } from '@tanstack/react-router';

import ContactPage from '../pages/company/content/ContactPage';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});
