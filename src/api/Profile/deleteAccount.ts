import { supabase } from "../../utils/supabase";

export async function deleteAccount(): Promise<string | null> {
	const { error } = await supabase.rpc("delete_account");
	if (error) {
		return error.message;
	}
	await supabase.auth.signOut();
	return null;
}