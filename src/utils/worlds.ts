import type { BookEntry, World } from '../types';
import { getLocale } from '../paraglide/runtime.js';

export type WorldRow = { name: string; books: BookEntry[]; saved?: World };

const key = (name: string) => name.trim().toLowerCase();

/* Imagined worlds: the books' imagined places grouped by name (any case), then the worlds the reader saved by hand
   that no book has gone to yet. Most books first, then by name. */
export function worldsOf(books: BookEntry[], saved: World[]): WorldRow[] {
  const by = new Map<string, WorldRow>();
  for (const book of books)
    for (const p of book.places ?? []) {
      if (!p.imagined || !p.name.trim()) continue;
      const w = by.get(key(p.name)) ?? { name: p.name.trim(), books: [] };
      if (!w.books.includes(book)) w.books.push(book);
      by.set(key(p.name), w);
    }
  for (const w of saved) {
    const row = by.get(key(w.name));
    if (row) row.saved = w;
    else by.set(key(w.name), { name: w.name, books: [], saved: w });
  }
  return [...by.values()].sort(
    (a, b) =>
      b.books.length - a.books.length ||
      a.name.localeCompare(b.name, getLocale())
  );
}

export const sameWorld = (a: string, b: string) => key(a) === key(b);
