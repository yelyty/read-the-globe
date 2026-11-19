import type { BookEntry, World } from '../types';
import { getLocale } from '../paraglide/runtime.js';

export type WorldRow = { name: string; books: BookEntry[]; saved?: World };

const key = (name: string) => name.trim().toLowerCase();

/**
 * Gets the imagined worlds: the imagined places of the books, grouped by name, and the worlds the reader saved.
 * Names match in any case. The worlds with the most books come first, then they are sorted by name.
 */
export const worldsOf = (books: BookEntry[], saved: World[]): WorldRow[] => {
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
};

/**
 * Checks if two names are the same world. Case and spaces at the start and the end do not matter.
 */
export const sameWorld = (first: string, second: string) =>
  key(first) === key(second);
