import type { BookEntry } from '../../types';
import { readDate } from '../../utils/readDate';
import { isoYear } from '../../utils/isoDate';

export const authorCode = (book: BookEntry) => book.author?.country?.code;

export const yearOf = (book: BookEntry) => isoYear(readDate(book));

export const placeCodes = (book: BookEntry) =>
  (book.places ?? [])
    .map((place) => place.countryCode)
    .filter((code): code is string => !!code);
