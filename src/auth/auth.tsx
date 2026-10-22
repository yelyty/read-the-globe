import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { AuthContext } from "./auth-context";
import { toReader, type Reader } from "./session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Reader | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user && toReader(data.user));
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toReader(session.user) : null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
