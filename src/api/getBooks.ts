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
      createdaAt: created_at,
      author:authors (
        name,
        country:countries ( name, code )
      ),  places!places_book_id_fkey ( id, name, lon, lat, countryCode:country_code, bookId:book_id )(id, name, lon, lat, counterCode: country_code, bookId: book_id)
    `)
		.eq("user_id", user.id)
		.order("created_at", { ascending: false })
		.returns<BookEntry[]>();

	if (error) {
		console.error(error);
		return [];
	}

	return books ?? [];
}

export default getBooks;