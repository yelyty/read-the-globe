import type { BookEntry } from "../../types";

const today = () => new Date().toISOString().slice(0, 10);

const download = (text: string, name: string, type: string) => {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([text], { type }));
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 0);
};

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

// The reading list in the importer's own columns (title, author, the author's country, places as "City, Country; City",
// the date), so it opens in any spreadsheet and can come back in.
export function exportReadingList(books: BookEntry[], names: Record<string, string>) {
	const place = (p: BookEntry["places"][number]) => {
		const country = p.countryCode ? (names[p.countryCode] ?? "") : "";
		return p.name && p.name !== country ? [p.name, country].filter(Boolean).join(", ") : country;
	};
	const rows = [
		["title", "author", "author_country", "places", "date"],
		...books.map((b) => [
			b.title,
			b.author?.name ?? "",
			b.author?.country?.name ?? "",
			(b.places ?? []).map(place).filter(Boolean).join("; "),
			(b.createdAt ?? "").slice(0, 10),
		]),
	];
	download(rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n", `read-the-globe-reading-list-${today()}.csv`, "text/csv");
}

// everything the atlas holds, as loaded
export function exportBackup(books: BookEntry[]) {
	download(JSON.stringify({ exported: new Date().toISOString(), books }, null, 2), `read-the-globe-backup-${today()}.json`, "application/json");
}

export const bookCount = (n: number) => `${n} ${n === 1 ? "book" : "books"}`;