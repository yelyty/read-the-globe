import { createFileRoute } from '@tanstack/react-router';
import GoalsPage from '../pages/GoalsPage/GoalsPage';

type GoalsSearch = { add?: string };

export const Route = createFileRoute('/app/goals')({
  // ?add=<slug>: a Journal article's "Add this goal" link
  validateSearch: (search: Record<string, unknown>): GoalsSearch => ({
    add: typeof search.add === 'string' ? search.add : undefined,
  }),
  component: () => <GoalsPage />,
});
