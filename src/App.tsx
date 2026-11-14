import { useEffect, useRef } from 'react';
import { RouterProvider } from '@tanstack/react-router';

import { useAuth } from './auth/auth-context';
import { router } from './router';

export function App() {
  const auth = useAuth();
  const wasIn = useRef(false);

  /* Signed out (the account menu, a deleted account, another tab, an expired session): leave the app, but only now,
     once the router has the signed-out auth. Going to '/' any sooner, it still thinks the reader is in and sends them
     back to /app, whose loaders then fail with the session gone ("Something went wrong"). */
  useEffect(() => {
    if (auth.loading) return;

    if (
      wasIn.current &&
      !auth.user &&
      router.state.location.pathname.startsWith('/app')
    ) {
      router.clearCache();
      void router.navigate({ to: '/' });
    }

    wasIn.current = !!auth.user;
  }, [auth.loading, auth.user]);

  if (auth.loading) return null;

  return <RouterProvider router={router} context={{ auth }} />;
}
