import type { BookEntry } from "../types";
import { CONTINENT_OF } from "./continents";

// Every book leaves two kinds of mark: the countries its story is set in, and its author's country.
export type Mark = { set: BookEntry[]; author: BookEntry[] };
export type Marks = Record<string, Mark>;

export function atlasMarks(books: BookEntry[]): Marks {
	const marks: Marks = {};
	const at = (code: string) => (marks[code] ??= { set: [], author: [] });
	for (const book of books) {
		const authorCountry = book.author?.country?.code;
		if (authorCountry) at(authorCountry).author.push(book);
		const setIn = new Set((book.places ?? []).map((p) => p.countryCode).filter((c): c is string => !!c));
		for (const code of setIn) at(code).set.push(book);
	}
	return marks;
}

export function atlasStats(books: BookEntry[], marks: Marks) {
	const codes = Object.keys(marks);
	return {
		books: books.length,
		countries: codes.length,
		set: codes.filter((c) => marks[c].set.length).length,
		authors: codes.filter((c) => marks[c].author.length).length,
		continents: new Set(codes.map((c) => CONTINENT_OF[c]).filter(Boolean)).size,
	};
}
