import type { BookEntry } from '../types';
import { isoDay, isoYear, isoYearMonth } from './isoDate';

/**
 * Gets the day a book was read. If the book has no date, the function gives the day it was logged.
 */
export const readDate = (book: BookEntry) =>
  book.readOn ?? isoDay(book.createdAt ?? '');

/**
 * Gets the year a book was read, YYYY.
 */
export const readYear = (book: BookEntry) => isoYear(readDate(book));

/**
 * Sorts books by the date they were read, newest first. Books with the same date keep their order.
 */
export const byReadDate = (left: BookEntry, right: BookEntry) =>
  readDate(right).localeCompare(readDate(left));

/**
 * Sorts books by the date they were logged, newest first.
 */
export const byLogged = (left: BookEntry, right: BookEntry) =>
  (right.createdAt ?? '').localeCompare(left.createdAt ?? '');

/**
 * Gets the read date to save from the month and the year of the log form.
 * @param startYm - The month the form started with, YYYY-MM.
 * @param today - The day today, YYYY-MM-DD.
 * @returns Null if the month is empty or did not change. Today if the month is this month. If not, the 1st of the month.
 */
export function readOnFor(
  mon: string,
  year: string,
  startYm: string,
  today: string
): string | null {
  if (!mon && !year) return null;
  const ym = `${year || isoYear(today)}-${mon || '01'}`;

  if (ym === startYm) return null;

  return ym === isoYearMonth(today) ? today : `${ym}-01`;
}

/**
 * Gets today in the time zone of the reader, YYYY-MM-DD.
 */
export const localToday = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
