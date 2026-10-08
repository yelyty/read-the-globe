import type { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";


export interface Reader {
	id: string;
	email: string | null;
	signUpName: string | null;
}

export const toReader = (user: User): Reader => ({
	id: user.id,
	email: user.email ?? null,
	signUpName: typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display.name : null
}
)

export type AuthProblem = "wrong-credentials" | "email-taken" | "failed";

export async function signIn(
	email: string,
	password: string,
): Promise<AuthProblem | null> {
	try {
		const { error } = await supabase.auth.signInWithPassword({
			email, password
		});
		if (!error) return null;
		return error.code === "invalid_credentials" ? "wrong-credentials" : "failed"
	} catch {
		return "failed"
	}
}

export async function signUp(details: {
	email: string,
	password: string,
	name: string,
}): Promise<{ problem: AuthProblem | null; confirmEmail: boolean }> {
	try {
		const { data, error } = await supabase.auth.signUp({
			email: details.email,
			password: details.password,
			options: {
				data: { display_name: details.name }
			}
		});
		if (error) {
			const taken = error.code === "user_already_exists" || error.code === "email_exists";
			return { problem: taken ? "email-taken" : "failed", confirmEmail: false }
		}
		return { problem: null, confirmEmail: !data.session }
	} catch {
		return { problem: "failed", confirmEmail: false }
	}
}