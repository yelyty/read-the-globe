import type { BookEntry } from '../types';

/* A book marks countries two ways: where its author is from, and where its story is set. Everything that reads a
   book's countries (the atlas, the Shelf's filters, postcards, the line said after a pin) reads them here.
   An imagined world is a place with no country, so it never counts. */

/** where the author is from, if that's known */
export const authorCountry = (book: BookEntry): string | undefined =>
  book.author?.country?.code ?? undefined;

/** where the story is set: the countries of its real places, in the order they were logged */
export const storyCountries = (book: BookEntry): string[] =>
  (book.places ?? [])
    .map((place) => place.countryCode)
    .filter((code): code is string => !!code);

/** both marks: the author's country first, then the story's (a country can come twice) */
export const bookCountries = (book: BookEntry): string[] => {
  const author = authorCountry(book);

  return author ? [author, ...storyCountries(book)] : storyCountries(book);
};
