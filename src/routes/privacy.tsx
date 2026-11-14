import { createFileRoute } from '@tanstack/react-router';
import PrivacyPage from '../pages/company/content/PrivacyPage';

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
});
