import { createFileRoute } from '@tanstack/react-router';
import JournalPage from '../pages/company/content/JournalPage';

export const Route = createFileRoute('/journal')({
  component: JournalPage,
});
