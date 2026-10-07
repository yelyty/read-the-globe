import type { SaveBookState } from "../AddBook";
import { supabase } from "../utils/supabase";

type PlaceInput = {
	name: string;
	lon: number;
	lat: number;
	countryCode?: string | null;
};


async function saveBook(
	_prevState: SaveBookState,
	formData: FormData,
): Promise<SaveBookState> {
	const countryCode = (formData.get("countryCode") as string) || null;
	const title = (formData.get("title") as string).trim();
	const authorName = (formData.get("author") as string).trim();
	const places: PlaceInput[] = JSON.parse(
		(formData.get("places") as string) || "[]",
	);

	// 1. Find the author, or create them if new (their country goes on the book, step 2)
	let authorId: number;

	const { data: existingAuthor, error: findError } = await supabase
		.from("authors")
		.select("id")
		.ilike("name", authorName.replace(/[\\%_]/g, "\\$&"))
		.order("id")
		.limit(1)
		.maybeSingle();

	if (findError) {
		return { success: false, error: findError.message };
	}

	if (existingAuthor) {
		authorId = existingAuthor.id;
	} else {
		const { data: newAuthor, error: authorError } = await supabase
			.from("authors")
			.insert({ name: authorName })
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
		.insert({ title, author_id: authorId, author_country_code: countryCode })
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
				country_code: p.countryCode ?? null
			})),
		);

		if (placesError) {
			return { success: false, error: placesError.message };
		}
	}

	return { success: true, error: null };
}
export default saveBook;