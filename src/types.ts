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
	places: Place[];
	goals: {
		goalId: number
	}[]
}

export interface CountryGroup {
	code: string;
	name: string;
	books: BookEntry[];
}

export interface CountryData {
	[countryCode: string]: CountryGroup;
}

export interface Place {
	id: string;
	name: string;
	lon: number;
	lat: number;
	bookId: string;
}

export interface Goal {
	id: number;
	name: string;
	countryCodes: string[] | null;
	target: number | null;
}

export interface Profile {
	displayName: string;
	handle: string | null;
	createdAt: string;
}

