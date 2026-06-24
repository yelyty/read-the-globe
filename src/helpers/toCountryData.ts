import type { BookEntry, CountryData } from "../types";

const toCountryData = (entries: BookEntry[]): CountryData => {
	return entries.reduce<CountryData>((acc, entry) => {
		const country = entry.author?.country;
		if (!country?.code) {
			return acc;
		}

		const existing = acc[country.code];
		if (existing) {
			existing.books.push(entry);
		} else {
			acc[country.code] = {
				code: country.code,
				name: country.name,
				books: [entry],
			};
		}

		return acc;
	}, {});
};

export default toCountryData;