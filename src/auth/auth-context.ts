import { createContext, useContext } from 'react';

import type { Reader } from './session';

export type AuthContextValue = {
  isAuthenticated: boolean;
  user: Reader | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Gets the auth state: if a reader is signed in, the reader, and if the state is still loading.
 * The function throws an error outside AuthProvider.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return ctx;
};
