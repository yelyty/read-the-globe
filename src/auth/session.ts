import type { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";


export interface Reader {
	id: string;
	email: string | null;
	signUpName: string | null;
	createdAt: string
}

export const toReader = (user: User): Reader => ({
	id: user.id,
	email: user.email ?? null,
	signUpName: typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display.name : null,
	createdAt: user.created_at
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

export async function signOut(): Promise<void> {
	await supabase.auth.signOut();
}

export async function updateDisplayName(name: string): Promise<string | null> {
	const { error } = await supabase.auth.updateUser({ data: { display_name: name } });
	return error ? "Couldn't save your name. Try again" : null;
}

export async function changePassword(password: string): Promise<string | null> {
	const { error } = await supabase.auth.updateUser({ password });

	if (!error) return null;
	if (error.code === "same_password") return "That's your current password. Choose a new one.";
	if (error.code === "weak_password") return "Choose a stronger password: at least 8 characters.";
	if (error.code === "reauthentication_needed") return "For your safety, sign out and in again, then change your password."

	return "Couldn't change your password. Try again."
}