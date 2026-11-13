import { useCallback, useState } from 'react';

import { signOut } from '../auth/session';

// App takes the reader back to '/' once the sign-out has reached the router (see App.tsx)
export function useSignOut() {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);

    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }, [signingOut]);

  return { signOut: handleSignOut, signingOut };
}
