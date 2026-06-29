import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./utils/supabase";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
