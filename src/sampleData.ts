import type { CountryData, Place, Country } from "./types";

const COLOMBIA: Country = { name: "Colombia", code: "CO" };
const JAPAN: Country = { name: "Japan", code: "JP" };
const UK: Country = { name: "United Kingdom", code: "GB" };
const NIGERIA: Country = { name: "Nigeria", code: "NG" };

export const sampleCountries: CountryData = {
	CO: {
		code: "CO",
		name: "Colombia",
		books: [
			{ id: "b1", title: "One Hundred Years of Solitude", createdAt: "2026-01-12T09:00:00Z", author: { name: "Gabriel García Márquez", country: COLOMBIA } },
			{ id: "b2", title: "Love in the Time of Cholera", createdAt: "2026-02-03T19:30:00Z", author: { name: "Gabriel García Márquez", country: COLOMBIA } },
		],
	},
	JP: {
		code: "JP",
		name: "Japan",
		books: [
			{ id: "b3", title: "Norwegian Wood", createdAt: "2026-01-28T21:15:00Z", author: { name: "Haruki Murakami", country: JAPAN } },
			{ id: "b4", title: "The Sound of the Mountain", createdAt: "2026-03-10T08:45:00Z", author: { name: "Yasunari Kawabata", country: JAPAN } },
		],
	},
	GB: {
		code: "GB",
		name: "United Kingdom",
		books: [
			{ id: "b5", title: "A Passage to India", createdAt: "2026-02-20T14:00:00Z", author: { name: "E. M. Forster", country: UK } },
			{ id: "b6", title: "Mrs Dalloway", createdAt: "2026-04-01T11:20:00Z", author: { name: "Virginia Woolf", country: UK } },
		],
	},
	NG: {
		code: "NG",
		name: "Nigeria",
		books: [
			{ id: "b7", title: "Things Fall Apart", createdAt: "2026-01-05T17:40:00Z", author: { name: "Chinua Achebe", country: NIGERIA } },
			{ id: "b8", title: "Half of a Yellow Sun", createdAt: "2026-03-22T20:10:00Z", author: { name: "Chimamanda Ngozi Adichie", country: NIGERIA } },
		],
	},
};

export const samplePlaces: Place[] = [
	{ id: "p1", name: "Colombia", lon: -74.07, lat: 4.71, book_id: "b1" },
	{ id: "p2", name: "India", lon: 78.96, lat: 20.59, book_id: "b5" },
	{ id: "p3", name: "Tokyo, Japan", lon: 139.69, lat: 35.68, book_id: "b3" },
	{ id: "p4", name: "Nigeria", lon: 8.67, lat: 9.08, book_id: "b7" },
];