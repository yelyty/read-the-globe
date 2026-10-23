import type { NextRead } from "../../types";
import { supabase } from "../../utils/supabase";

const FIELDS = "id, title, author, countryCode:country_code, mark, createdAt:created_at";

export async function getNextReads(userId: string): Promise<{ items: NextRead[]; failed: boolean }> {
	const { data, error } = await supabase
		.from("next_reads")
		.select(FIELDS)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.returns<NextRead[]>();
	if (error) console.error(error);
	return { items: data ?? [], failed: !!error };
}

export async function addNextRead(item: Pick<NextRead, "title" | "author" | "countryCode" | "mark">): Promise<NextRead | null> {
	const { data, error } = await supabase
		.from("next_reads")
		.insert({ title: item.title, author: item.author, country_code: item.countryCode, mark: item.mark })
		.select(FIELDS)
		.single<NextRead>();
	if (error) console.error(error);
	return data;
}

export async function removeNextRead(id: string): Promise<boolean> {
	const { error } = await supabase.from("next_reads").delete().eq("id", id);
	if (error) console.error(error);
	return !error;
}
