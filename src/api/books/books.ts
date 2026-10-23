import { supabase } from "../../utils/supabase";

export type BookDraft = {
	title: string;
	author: string;
	authorCountry: string;
	/** ISO date; null keeps the book's date (today for a new one) */
	readOn: string | null;
	places: { name: string; country: string }[];
	goalIds: number[];
};


export async function saveBook(draft: BookDraft, id?: string): Promise<string | null> {
	const { error } = await supabase.rpc("save_book", {
		p_book_id: id ?? null,
		p_title: draft.title,
		p_author: draft.author,
		p_author_country: draft.authorCountry,
		p_read_on: draft.readOn,
		p_places: draft.places,
		p_goal_ids: draft.goalIds,
	});
	if (error) console.error(error);
	return error ? "That couldn’t be saved. Check your connection and try again." : null;
}


export async function deleteBook(id: string): Promise<string | null> {
	const { error } = await supabase.from("books").delete().eq("id", id);
	if (error) console.error(error);
	return error ? "That couldn’t be removed. Try again." : null;
}
