import type { BookEntry } from '../types';
import { countryFrom } from './countryFrom';
import { readDate } from './readDate';

/* A reading list as CSV: title, author, the author's country, places ("City, Country; City") and an optional
   date (YYYY-MM-DD, or just YYYY-MM). The export writes these columns and the import reads them, so it round-trips. */
export const CSV_HEAD = ['title', 'author', 'author_country', 'places', 'date'];

const cell = (v: string) =>
  /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;

export const toCsv = (rows: string[][]) =>
  rows.map((r) => r.map(cell).join(',')).join('\n') + '\n';

// quoted cells may hold commas, line breaks and "" for a quote; blank lines are dropped
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let quoted = false;
  const src = text.replace(/^\uFEFF/, ''); // Excel's byte order mark
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        value += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else value += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(value);
      value = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else value += ch;
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

// the shelf as rows; an imagined place is written "Middle-earth (imagined)"
export function readingListRows(
  books: BookEntry[],
  names: Record<string, string>
): string[][] {
  const place = (p: BookEntry['places'][number]) => {
    if (p.imagined) return `${p.name} (imagined)`;
    const country = p.countryCode ? (names[p.countryCode] ?? '') : '';
    return p.name && p.name !== country
      ? [p.name, country].filter(Boolean).join(', ')
      : country;
  };
  return [
    CSV_HEAD,
    ...books.map((b) => [
      b.title,
      b.author?.name ?? '',
      // the map's name, which the import reads back; the database's for a country too small for the map
      (b.author?.country && names[b.author.country.code]) ??
        b.author?.country?.name ??
        '',
      (b.places ?? []).map(place).filter(Boolean).join('; '),
      readDate(b),
    ]),
  ];
}

export type ImportedBook = {
  title: string;
  author: string;
  authorCountry: string;
  /** YYYY-MM-DD; null is today */
  readOn: string | null;
  places: { name: string; country: string | null; imagined?: boolean }[];
};

/* The books in a reading list, and how many rows can't be one: each needs a title, an author and a country the map
   knows. ponytail: a place is a country, "City, Country" or an imagined world; a bare city is dropped, as there is
   no gazetteer yet */
export function booksFromCsv(
  text: string,
  names: Record<string, string>
): { books: ImportedBook[]; problems: number } {
  const rows = parseCsv(text);
  if (rows.length && /title/i.test(rows[0][0] ?? '')) rows.shift();
  const books: ImportedBook[] = [];
  let problems = 0;
  for (const [
    title = '',
    author = '',
    country = '',
    places = '',
    date = '',
  ] of rows) {
    const c = countryFrom(country, names);
    if (!title.trim() || !author.trim() || !c) {
      problems++;
      continue;
    }
    const day = date.trim();
    books.push({
      title: title.trim(),
      author: author.trim(),
      authorCountry: c.code,
      readOn: /^\d{4}-\d{2}-\d{2}$/.test(day)
        ? day
        : /^\d{4}-\d{2}$/.test(day)
          ? `${day}-01`
          : null,
      places: places
        .split(';')
        .map((p) => p.trim())
        .filter(Boolean)
        .flatMap((p): ImportedBook['places'] => {
          const world = p.match(/^(.+?)\s*\(imagined\)$/i);
          if (world) return [{ name: world[1], country: null, imagined: true }];
          const split = p.match(/^(.*),\s*([^,]+)$/);
          const inCountry = split && countryFrom(split[2], names);
          if (split && inCountry)
            return [{ name: split[1].trim(), country: inCountry.code }];
          const bare = countryFrom(p, names);
          return bare
            ? [
                {
                  name: bare.as ?? bare.then ?? names[bare.code] ?? p,
                  country: bare.code,
                },
              ]
            : [];
        }),
    });
  }
  return { books, problems };
}
