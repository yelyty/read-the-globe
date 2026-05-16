import type { BookEntry, CountryData } from "../types";

const toCountryData = (entries: BookEntry[]): CountryData => {
	return entries.reduce<CountryData>((acc, entry) => {
		if (!entry.countryCode) {
			return acc;
		}

		acc[entry.countryCode] = entry;

		return acc;
	}, {});
}

export default toCountryData;