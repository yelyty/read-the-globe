export interface Country {
	name: string;
	code: string;
}

export interface Author {
	name: string;
	country: Country | null;
}

export interface BookEntry {
	id: string;
	title: string;
	createdAt?: string;
	author: Author | null;
}

export interface CountryGroup {
	code: string;
	name: string;
	books: BookEntry[];
}

export interface CountryData {
	[countryCode: string]: CountryGroup;
}