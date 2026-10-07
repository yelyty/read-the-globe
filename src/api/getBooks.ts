import { supabase } from "../utils/supabase";
import type { BookEntry, Country } from "../types";

type BookRow = Omit<BookEntry, "author"> & {
	author: { name: string } | null;
	authorCountry: Country | null;
}

async function getBooks(userId: string): Promise<BookEntry[]> {
	const { data: books, error } = await supabase
		.from("books")
		.select(`
      id,
      title,
      createdAt: created_at,
	  author: authors( name ),
      authorCountry:countries!books_author_country_code_fkey (
        name,
        code
      ),  
	  places!places_book_id_fkey ( id, name, lon, lat, countryCode:country_code, bookId:book_id )
    `)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.returns<BookRow[]>();

	if (error) {
		throw new Error("Couldn't load your books");
	}

	// TODO: Refactor
	return (books ?? []).map(({ authorCountry, ...book }) => ({
		...book,
		author: book.author && { ...book.author, country: authorCountry }
	}));
}

export default getBooks;