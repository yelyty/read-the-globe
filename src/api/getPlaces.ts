import { supabase } from "../utils/supabase";
import type { Place } from "../types";

async function getPlaces(): Promise<Place[]> {
	const { data: places, error } = await supabase
		.from("places")
		.select("id, name, lon, lat, book_id");

	if (error) {
		console.error(error);
		return [];
	}

	return places ?? [];
}

export default getPlaces;