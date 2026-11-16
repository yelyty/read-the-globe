import { useMemo } from 'react';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
  type RouteComponent,
} from '@tanstack/react-router';

type StoryRouterProps = { story: RouteComponent };

/** a router of the story's own, in memory, with the story as its only page */
const StoryRouter = ({ story }: StoryRouterProps) => {
  const router = useMemo(
    () =>
      createRouter({
        routeTree: createRootRoute({ component: story }),
        history: createMemoryHistory(),
      }),
    [story]
  );

  return <RouterProvider router={router} />;
};

export default StoryRouter;
