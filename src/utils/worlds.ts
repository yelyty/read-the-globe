import type { BookEntry, World } from '../types';
import { getLocale } from '../paraglide/runtime.js';

export type WorldRow = { name: string; books: BookEntry[]; saved?: World };

const key = (name: string) => name.trim().toLowerCase();

/* Imagined worlds: the books' imagined places grouped by name (any case), then the worlds the reader saved by hand
   that no book has gone to yet. Most books first, then by name. */
export function worldsOf(books: BookEntry[], saved: World[]): WorldRow[] {
  const by = new Map<string, WorldRow>();

  for (const book of books)
    for (const place of book.places ?? []) {
      if (!place.imagined || !place.name.trim()) continue;

      const world = by.get(key(place.name)) ?? {
        name: place.name.trim(),
        books: [],
      };

      if (!world.books.includes(book)) world.books.push(book);
      by.set(key(place.name), world);
    }

  for (const world of saved) {
    const row = by.get(key(world.name));

    if (row) row.saved = world;
    else by.set(key(world.name), { name: world.name, books: [], saved: world });
  }

  return [...by.values()].sort(
    (first, second) =>
      second.books.length - first.books.length ||
      first.name.localeCompare(second.name, getLocale())
  );
}

export const sameWorld = (first: string, second: string) =>
  key(first) === key(second);
