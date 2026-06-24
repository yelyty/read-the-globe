import { supabase } from "../utils/supabase";
import type { BookEntry } from "../types";

async function getBooks(): Promise<BookEntry[]> {
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return [];
	}

	const { data: books, error } = await supabase
		.from("books")
		.select(`
      id,
      title,
      created_at,
      author:authors (
        name,
        country:countries ( name, code )
      )
    `)
		.eq("user_id", user.id)
		.returns<BookEntry[]>();

	if (error) {
		console.error(error);
		return [];
	}

	return books ?? [];
}

export default getBooks;