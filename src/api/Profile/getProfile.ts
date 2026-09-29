import type { Profile } from "../../types";
import { supabase } from "../../utils/supabase";

export async function getProfile(userId: string): Promise<Profile | null> {
	const { data, error } = await supabase
		.from("profiles")
		.select("display_name, handle, created_at")
		.eq("id", userId)
		.maybeSingle<Profile>();

	if (error) console.error(error);
	return data;
}