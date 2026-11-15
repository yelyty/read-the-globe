import type { BookDraft } from '../../api/books/books';
import type { Landing } from '../../hooks/useLanding';
import type { BookEntry, Goal } from '../../types';
import { goalProgress, isDone } from '../../pages/goals/goalProgress';
import { atlasMarks } from '../../utils/atlasMarks';
import { authorCountry } from '../../utils/book';
import {
  countryFrom,
  splitStates,
  tidy,
  type CountryMatch,
} from '../../utils/countryFrom';
import { pinMoment } from '../../utils/pinMoment';
import { localToday, readDate, readOnFor } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import type { Row } from './placeRow';

/* Logging a book, apart from the form that shows it: reading what was typed into countries, the errors to show,
   the book to save, the same book logged twice, and where a new book lands on Home. */

/** a place's error is filed under its row: 'place-<key>' */
export const PLACE_KEY = 'place-';

/** what the reader has typed into the log form */
export type LogFields = {
  title: string;
  author: string;
  /** the author's country, as typed */
  country: string;
  /** the country chosen for a state that split ("Yugoslavia"), if any */
  authorPick: string;
  rows: Row[];
  /** the read month and year chosen ('' for untouched), and the book's own YYYY-MM when editing */
  month: string;
  year: string;
  startMonth: string;
  /** theme goals ticked */
  goalIds: number[];
};

/** a place row read against the country names: blank rows are left out */
export type ReadPlace =
  | { key: number; name: string; imagined: true }
  | {
      key: number;
      name: string;
      imagined: false;
      /** what was typed as its country */
      typed: string;
      match: CountryMatch | null;
    };

/** the form, read: its countries, what Pin it will mark, what's wrong, and the book to save once nothing is */
export type LogReading = {
  places: ReadPlace[];
  authorCode?: string;
  /** the countries Pin it will mark, with which mark */
  marks: Record<string, { set?: boolean; author?: boolean }>;
  /** what's wrong, by field: 'title', 'author', 'country' or a place's PLACE_KEY + key */
  errors: Record<string, string>;
  /** the book to save; null while anything is wrong */
  draft: BookDraft | null;
};

/** "City, Country" in one go: the city and the country's code, when the part after the comma is a country */
export const splitPlace = (raw: string, names: Record<string, string>) => {
  const hit = raw.match(/^(.*),\s*([^,]+)$/);
  const match = hit && countryFrom(hit[2], names);

  return hit && match ? { name: hit[1].trim(), code: match.code } : null;
};

const readPlace = (placeRow: Row, names: Record<string, string>): ReadPlace => {
  if (placeRow.imagined)
    return { key: placeRow.key, name: tidy(placeRow.name), imagined: true };
  const split = splitPlace(placeRow.name, names);

  return {
    key: placeRow.key,
    name: split ? split.name : placeRow.name.trim(),
    imagined: false,
    typed: placeRow.country.trim(),
    match:
      countryFrom(placeRow.country, names, placeRow.pick) ??
      (split ? { code: split.code } : null),
  };
};

const countryError = (typed: string, place: boolean) =>
  splitStates(typed)
    ? m.log_choose_today({ name: tidy(typed) })
    : typed
      ? m.log_no_country({ typed })
      : place
        ? m.log_add_place_country()
        : m.log_add_author_country();

/** Reads the log form: every render, for the preview, and on Pin it, for the errors and the book to save. */
export function readLog(
  fields: LogFields,
  names: Record<string, string>,
  today = localToday()
): LogReading {
  const name = (code: string) => names[code] ?? '';

  const places = fields.rows
    .filter(
      (placeRow) =>
        placeRow.name.trim() || (!placeRow.imagined && placeRow.country.trim())
    )
    .map((placeRow) => readPlace(placeRow, names));

  const authorCode = countryFrom(
    fields.country,
    names,
    fields.authorPick
  )?.code;

  const marks: LogReading['marks'] = {};

  if (authorCode) marks[authorCode] = { author: true };

  for (const place of places)
    if (!place.imagined && place.match)
      marks[place.match.code] = { ...marks[place.match.code], set: true };

  const errors: Record<string, string> = {};

  if (!fields.title.trim()) errors.title = m.log_need_title();
  if (!fields.author.trim()) errors.author = m.log_need_author();
  if (!authorCode) errors.country = countryError(fields.country.trim(), false);

  for (const place of places)
    if (!place.imagined && !place.match)
      errors[`${PLACE_KEY}${place.key}`] = countryError(place.typed, true);

  const draft: BookDraft | null =
    Object.keys(errors).length || !authorCode
      ? null
      : {
          title: fields.title.trim(),
          author: fields.author.trim(),
          authorCountry: authorCode,
          // the read month goes to read_on; created_at stays the day it was logged (Home's Recent reads)
          readOn: readOnFor(
            fields.month,
            fields.year,
            fields.startMonth,
            today
          ),
          // ponytail: an old name or a territory isn't kept beside the country; it only names an unnamed place
          places: places.map((place) =>
            place.imagined
              ? { name: place.name, country: null, imagined: true }
              : {
                  name:
                    place.name ||
                    place.match!.as ||
                    place.match!.then ||
                    name(place.match!.code),
                  country: place.match!.code,
                }
          ),
          goalIds: fields.goalIds,
        };

  return { places, authorCode, marks, errors, draft };
}

/** The same title and author already on the atlas: usually a slip, so the form says so once. */
export const duplicateOf = (draft: BookDraft, books: BookEntry[]) => {
  const key = `${draft.title}|${draft.author}`.toLowerCase();

  return books.find(
    (entry) =>
      `${entry.title}|${entry.author?.name ?? ''}`.toLowerCase() === key
  );
};

/** A saved book as the draft that saves it again: how Undo puts a removed book back. */
export const draftOf = (book: BookEntry): BookDraft => ({
  title: book.title,
  author: book.author?.name ?? '',
  authorCountry: authorCountry(book) ?? '',
  readOn: readDate(book),
  places: book.places.map((place) => ({
    name: place.name,
    country: place.imagined ? null : (place.countryCode ?? ''),
    imagined: place.imagined,
  })),
  goalIds: book.goals.map((goal) => goal.goalId),
});

// the book as it will be on the atlas, before the saved row comes back
const entryOf = (
  id: string,
  draft: BookDraft,
  names: Record<string, string>
): BookEntry => ({
  id,
  title: draft.title,
  author: {
    name: draft.author,
    country: {
      code: draft.authorCountry,
      name: names[draft.authorCountry] ?? '',
    },
  },
  places: draft.places.map((place, i) => ({
    id: String(i),
    name: place.name,
    lon: 0,
    lat: 0,
    countryCode: place.country,
    bookId: id,
    imagined: place.imagined,
  })),
  goals: draft.goalIds.map((goalId) => ({ goalId })),
});

type Shelf = {
  books: BookEntry[];
  goals: Goal[];
  names: Record<string, string>;
};

/** Where a new book lands on Home: the pin line, and the goal it carried over its flag, if any. */
export function landingFor(
  id: string,
  draft: BookDraft,
  { books, goals, names }: Shelf
): Landing {
  const added = entryOf(id, draft, names);
  const all = [...books, added];
  const before = atlasMarks(books);
  const after = atlasMarks(all);

  // the Goals page stamps them when the reader goes to look
  const reached = goals.filter(
    (goal) =>
      !goal.reachedOn &&
      !isDone(goalProgress(goal, before, books)) &&
      isDone(goalProgress(goal, after, all))
  );

  const firstGoal = reached[0];
  const total = firstGoal && goalProgress(firstGoal, after, all).total;

  return {
    ...pinMoment(added, before, after, names),
    bookId: id,
    reached: firstGoal
      ? [
          m.log_goal_reached({
            name: firstGoal.name,
            total:
              firstGoal.kind === 'theme'
                ? m.count_book({ count: total })
                : m.log_all({ countries: m.count_country({ count: total }) }),
          }),
          reached.length > 1 && m.log_and_more({ count: reached.length - 1 }),
        ]
          .filter(Boolean)
          .join(' ')
      : null,
  };
}

// an error's field: its input's id, and its name in the summary
const fieldOf = (key: string): [id: string, label: string] =>
  ({
    title: ['f-title', m.log_f_title()] as [string, string],
    author: ['f-author', m.log_f_author()] as [string, string],
    country: ['f-country', m.log_f_country()] as [string, string],
  })[key] ?? [`pr-country-${key.slice(PLACE_KEY.length)}`, m.log_f_place()];

// what the form says over its errors: the one error, or which fields need a look; and the field to focus
export function errorSummary(errors: Record<string, string>) {
  const bad = Object.keys(errors);

  const text =
    bad.length === 1
      ? errors[bad[0]]
      : m.log_fields_need({
          fields: m.count_field({ count: bad.length }),
          list: [...new Set(bad.map((key) => fieldOf(key)[1]))].join(', '),
        });

  return { text, focusId: bad.length ? fieldOf(bad[0])[0] : null };
}
