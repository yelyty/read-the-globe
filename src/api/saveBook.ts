import type { SaveBookState } from "../AddBook";
import { supabase } from "../utils/supabase";

type PlaceInput = {
	name: string;
	lon: number;
	lat: number;
};

import { getCountryNames } from "../countryNames";

export async function seedCountries() {
	const names = await getCountryNames(); // { FR: "France", ... }
	const rows = Object.entries(names).map(([code, name]) => ({ code, name }));

	const { error } = await supabase.from("countries").upsert(rows); // PK = code
	if (error) console.error(error);
}

async function saveBook(
	_prevState: SaveBookState,
	formData: FormData,
): Promise<SaveBookState> {
	const countryCode = formData.get("countryCode") as string;
	const title = formData.get("title") as string;
	const authorName = formData.get("author") as string;
	const places: PlaceInput[] = JSON.parse(
		(formData.get("places") as string) || "[]",
	);

	// 1. Find the author, or create them if new
	let authorId: number;

	const { data: existingAuthor, error: findError } = await supabase
		.from("authors")
		.select("id")
		.eq("name", authorName)
		.maybeSingle();

	if (findError) {
		return { success: false, error: findError.message };
	}

	if (existingAuthor) {
		authorId = existingAuthor.id;
	} else {
		const { data: newAuthor, error: authorError } = await supabase
			.from("authors")
			.insert({ name: authorName, nationality_code: countryCode })
			.select("id")
			.single();

		if (authorError) {
			return { success: false, error: authorError.message };
		}
		authorId = newAuthor.id;
	}

	// 2. Insert the book pointing at the author
	const { data: book, error: bookError } = await supabase
		.from("books")
		.insert({ title, author_id: authorId })
		.select()
		.single();

	if (bookError) {
		return { success: false, error: bookError.message };
	}

	// 3. Insert places linked to the book
	if (places.length > 0) {
		const { error: placesError } = await supabase.from("places").insert(
			places.map((p) => ({
				book_id: book.id,
				name: p.name,
				lon: p.lon,
				lat: p.lat,
			})),
		);

		if (placesError) {
			return { success: false, error: placesError.message };
		}
	}

	return { success: true, error: null };
}
export default saveBook;