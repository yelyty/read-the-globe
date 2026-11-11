import type { BookEntry } from '../types';

// when a book was read (read_on); a book without one falls back to the day it was logged
export const readDate = (b: BookEntry) =>
  b.readOn ?? (b.createdAt ?? '').slice(0, 10);

// newest read first; ties keep the order they came in
export const byReadDate = (a: BookEntry, b: BookEntry) =>
  readDate(b).localeCompare(readDate(a));

// most recently logged first, whenever the books were read
export const byLogged = (a: BookEntry, b: BookEntry) =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

// the log form's month and year as a read_on date: null when untouched or unchanged (save_book keeps the date,
// today for a new book), today when it is this month, otherwise the 1st of that month
export function readOnFor(
  mon: string,
  year: string,
  startYm: string,
  today: string
): string | null {
  if (!mon && !year) return null;
  const ym = `${year || today.slice(0, 4)}-${mon || '01'}`;
  if (ym === startYm) return null;
  return ym === today.slice(0, 7) ? today : `${ym}-01`;
}

// the reader's own today, YYYY-MM-DD
export const localToday = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
