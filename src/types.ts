export interface BookEntry {
	id: string;
	title: string;
	author: string;
	createdAt?: string;
	countryCode?: string;
}

export interface CountryData {
	[countryCode: string]: BookEntry;
}
