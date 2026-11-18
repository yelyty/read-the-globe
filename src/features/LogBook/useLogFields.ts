import { useMemo, useState, type ChangeEvent } from 'react';

import type { BookEntry, Goal, NextRead } from '../../types';
import { useDirty } from '../../hooks/useUnsaved';
import { splitStates } from '../../utils/countryFrom';
import { isoMonth, isoYear, isoYearMonth } from '../../utils/isoDate';
import { readDate } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import { readLog } from './bookLog';
import { startRows, type Row } from './placeRow';

type LogFieldsStart = {
  book?: BookEntry;
  nextItem?: NextRead;
  setIn?: string;
  world?: string;
  names: Record<string, string>;
  books: BookEntry[];
  goals: Goal[];
  /** from useLogErrors: a field's change clears its error, and a new title or author the duplicate warning */
  fix: (key: string) => void;
  forgetDup: () => void;
};

/** The log form's fields, started from the book being edited, a Next to read item, a click on the map or a
    world's box; and what's typed, read into countries (log): the preview, and on Pin the errors or the book. */
export const useLogFields = ({
  book,
  nextItem,
  setIn,
  world,
  names,
  books,
  goals,
  fix,
  forgetDup,
}: LogFieldsStart) => {
  const name = (code?: string | null) => (code ? (names[code] ?? '') : '');

  const countries = useMemo(
    () =>
      Object.values(names).sort((left, right) =>
        left.localeCompare(right, getLocale())
      ),
    [names]
  );

  const startYm = book ? isoYearMonth(readDate(book)) : '';
  const themes = goals.filter((goal) => goal.kind === 'theme');
  const [title, setTitle] = useState(book?.title ?? nextItem?.title ?? '');

  const [author, setAuthor] = useState(
    book?.author?.name ?? nextItem?.author ?? ''
  );

  const [country, setCountry] = useState(
    name(
      book?.author?.country?.code ??
        (nextItem?.mark === 'author' ? nextItem.countryCode : null)
    )
  );

  const [authorPick, setAuthorPick] = useState('');
  const [authorOpen, setAuthorOpen] = useState(false);

  // a place to start with: from a Next to read item, a click on the map, or a world's box
  const startCountry = name(
    nextItem?.mark === 'set' ? nextItem.countryCode : setIn
  );

  const [rows, setRows] = useState<Row[]>(() =>
    startRows(book?.places ?? [], { world, country: startCountry }, name)
  );

  const [month, setMonth] = useState(isoMonth(startYm));
  const [year, setYear] = useState(isoYear(startYm));

  const [ticks, setTicks] = useState<number[]>(
    () =>
      book?.goals
        ?.map((goal) => goal.goalId)
        .filter((id) => themes.some((theme) => theme.id === id)) ?? []
  );

  // the goal ticks start open only if the book already counts toward one; after that the reader folds them
  const [ticksOpen] = useState(ticks.length > 0);
  const dirty = useDirty([title, author, country, rows, month, year, ticks]);

  // the line under the dialog's title: where a new book starts, or a welcome for the very first one
  const sub = book
    ? ''
    : world || startCountry
      ? m.log_sub_set_in({ place: world || startCountry })
      : books.length
        ? ''
        : m.log_sub_first();

  const log = readLog(
    {
      title,
      author,
      country,
      authorPick,
      rows,
      month,
      year,
      startMonth: startYm,
      goalIds: ticks,
    },
    names
  );

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    fix('title');
    forgetDup();
  };

  const handleAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
    fix('author');
    forgetDup();
  };

  const handleCountryValue = (value: string) => {
    setCountry(value);
    if (!splitStates(value)) setAuthorPick('');
    setAuthorOpen(false);
    fix('country');
  };

  const handleAuthorPick = (code: string) => {
    setAuthorPick(code);
    setAuthorOpen(false);
    fix('country');
  };

  const handleAuthorChoiceReopen = () => setAuthorOpen(true);

  return {
    countries,
    themes,
    sub,
    dirty,
    log,
    title,
    author,
    country,
    authorPick,
    authorOpen,
    rows,
    setRows,
    month,
    setMonth,
    year,
    setYear,
    ticks,
    setTicks,
    ticksOpen,
    handleTitleChange,
    handleAuthorChange,
    handleCountryValue,
    handleAuthorPick,
    handleAuthorChoiceReopen,
  };
};
