import { useCallback, useState } from 'react';

import { signOut } from '../auth/session';

/**
 * Signs the reader out. App takes the reader back to the landing page after the sign-out reaches the router.
 * @returns The sign-out handler, and if a sign-out is in progress.
 */
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
