import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface AuthContextValue {
	isAuthenticated: boolean;
	user: User | null;
	loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}