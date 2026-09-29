import type { Profile } from "../../types";
import { supabase } from "../../utils/supabase";

export async function updateProfile(
	userId: string,
	changes: Pick<Profile, "displayName" | "handle">,
): Promise<string | null> {
	const { error } = await supabase.from("profiles").update(changes).eq("id", userId);

	if (error?.code === "23505") return "That handle is taken. Try another.";
	return error?.message ?? null;
}