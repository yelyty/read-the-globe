import { supabase } from "../utils/supabase";
import type { BookEntry } from "../types";

async function getBooks(userId: string): Promise<BookEntry[]> {
	const { data: books, error } = await supabase
		.from("books")
		.select(`
      id,
      title,
      createdAt: created_at,
      author:authors (
        name,
        country:countries ( name, code )
      ),  places!places_book_id_fkey ( id, name, lon, lat, countryCode:country_code, bookId:book_id )
    `)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.returns<BookEntry[]>();

	if (error) {
		throw new Error("Couldn't load your books");
	}

	return books ?? [];
}

export default getBooks;