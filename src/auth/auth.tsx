import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { AuthContext } from './auth-context';
import { seedIfWished, toReader, type Reader } from './session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Reader | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // a reader who asked for example books is let in once they're there, so the atlas never opens empty
    const signIn = (next: User | null) =>
      next
        ? seedIfWished(next).then(() => setUser(toReader(next)))
        : setUser(null);

    supabase.auth
      .getUser()
      .then(({ data }) => signIn(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // supabase-js deadlocks on its own calls made inside this callback; run them just after it
      setTimeout(() => void signIn(session?.user ?? null));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
