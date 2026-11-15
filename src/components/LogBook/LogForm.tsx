import { useMemo, useState, type ChangeEvent, type SubmitEvent } from 'react';

import type { BookEntry, Goal, NextRead } from '../../types';
import { deleteBook, saveBook } from '../../api/books/books';
import { removeNextRead } from '../../api/nextReads/nextReads';
import { type Landing } from '../../hooks/useLanding';
import { splitStates } from '../../utils/countryFrom';
import { readDate } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import { useDirty } from '../../hooks/useUnsaved';
import { isoMonth, isoYear, isoYearMonth } from '../../utils/isoDate';
import { formatMonth } from '../../utils/formatDate';
import Field from '../Field/Field';
import Dialog from '../Dialog/Dialog';
import * as styles from './LogBook.css';
import AuthorCountryField from './AuthorCountryField';
import LogActions from './LogActions';
import LogPreview from './LogPreview';
import PlacesField from './PlacesField';
import ReadWhen from './ReadWhen';
import ThemeTicks from './ThemeTicks';
import { startRows, type Row } from './placeRow';
import { duplicateOf, landingFor, errorSummary, readLog } from './bookLog';

type LogFormProps = {
  book?: BookEntry;
  nextItem?: NextRead;
  /** a country to start with as a place */
  setIn?: string;
  /** an imagined world to start with as a place */
  world?: string;
  names: Record<string, string>;
  books: BookEntry[];
  goals: Goal[];
  /** the reader's imagined worlds, offered when a place is marked imagined */
  worlds: string[];
  onClose: () => void;
  onDone: (message: string, landing?: Landing) => void;
  onRemoved: (book: BookEntry) => void;
};

const LogForm = ({
  book,
  nextItem,
  setIn,
  world,
  names,
  books,
  goals,
  worlds,
  onClose,
  onDone,
  onRemoved,
}: LogFormProps) => {
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

  const sub = book
    ? ''
    : world || startCountry
      ? m.log_sub_set_in({ place: world || startCountry })
      : books.length
        ? ''
        : m.log_sub_first();

  const [mon, setMon] = useState(isoMonth(startYm));
  const [year, setYear] = useState(isoYear(startYm));

  const [ticks, setTicks] = useState<number[]>(
    () =>
      book?.goals
        ?.map((goal) => goal.goalId)
        .filter((id) => themes.some((theme) => theme.id === id)) ?? []
  );

  // the goal ticks start open only if the book already counts toward one; after that the reader folds them
  const [ticksOpen] = useState(ticks.length > 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [dupOk, setDupOk] = useState('');
  const [saving, setSaving] = useState(false);
  const dirty = useDirty([title, author, country, rows, mon, year, ticks]);

  // what's typed, read into countries: the preview below, and on Pin it the errors or the book to save
  const log = readLog(
    {
      title,
      author,
      country,
      authorPick,
      rows,
      month: mon,
      year,
      startMonth: startYm,
      goalIds: ticks,
    },
    names
  );

  const imagined = log.places.filter((place) => place.imagined);

  // an error goes as soon as its field is touched
  const fix = (key: string) => {
    if (!errors[key]) return;
    const rest = { ...errors };

    delete rest[key];
    setErrors(rest);
    if (!Object.keys(rest).length) setFormError('');
  };

  const forgetDup = () => {
    if (!dupOk) return;
    setDupOk('');
    setFormError('');
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const errs = log.errors;

    setErrors(errs);

    if (Object.keys(errs).length || !log.draft) {
      const summary = errorSummary(errs);

      setFormError(summary.text);
      if (summary.focusId) document.getElementById(summary.focusId)?.focus();

      return;
    }

    const draft = log.draft;
    // the same book twice is usually a slip: say so once, then let a second Pin it through
    const dup = !book && duplicateOf(draft, books);

    if (dup && dupOk !== dup.id) {
      setDupOk(dup.id);
      setFormError(m.log_dup({ month: formatMonth(readDate(dup)) }));

      return;
    }

    setSaving(true);
    const saved = await saveBook(draft, book?.id);

    if (saved.problem !== null) {
      setSaving(false);
      setFormError(saved.problem);

      return;
    }

    const id = saved.data;

    // logged from Next to read: it leaves that list (quietly: the book itself is saved)
    if (!book && nextItem) await removeNextRead(nextItem);

    onDone(
      book
        ? m.log_saved({ title: title.trim() })
        : m.log_pinned({ title: title.trim() }),
      book ? undefined : landingFor(id, draft, { books, goals, names })
    );
  };

  const remove = async () => {
    if (!book) return;
    setSaving(true);
    const error = await deleteBook(book.id);

    if (error) {
      setSaving(false);
      setFormError(error);

      return;
    }

    onRemoved(book);
  };

  const label = saving
    ? book
      ? m.log_saving()
      : m.log_pinning()
    : book
      ? m.log_save_changes()
      : dupOk
        ? m.log_pin_again()
        : m.log_pin_it();

  /* ---------- handlers ---------- */
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

  return (
    <Dialog
      open
      onClose={onClose}
      variant="sheet"
      className={styles.sheet}
      data-editing={Boolean(book)}
      title={book ? m.log_editing() : m.log_a_book()}
      sub={
        <>
          {book && <p className={styles.editing}>{book.title}</p>}
          {sub && <p className={styles.sub}>{sub}</p>}
        </>
      }
      initialFocus="f-title"
      dirty={dirty}
      backdropClose={false}
    >
      <LogPreview marks={log.marks} imagined={imagined} names={names} />

      <form onSubmit={submit} noValidate>
        <Field
          id="f-title"
          label={m.log_title()}
          autoComplete="off"
          maxLength={200}
          placeholder={m.log_title_ph()}
          value={title}
          error={errors.title}
          onChange={handleTitleChange}
        />

        <Field
          id="f-author"
          label={m.log_author()}
          autoComplete="off"
          maxLength={120}
          placeholder={m.log_author_ph()}
          value={author}
          error={errors.author}
          onChange={handleAuthorChange}
        />

        <AuthorCountryField
          value={country}
          error={errors.country}
          countries={countries}
          names={names}
          pick={authorPick}
          pickOpen={authorOpen}
          onValue={handleCountryValue}
          onPick={handleAuthorPick}
          onPickReopen={handleAuthorChoiceReopen}
        />

        <PlacesField
          rows={rows}
          setRows={setRows}
          errors={errors}
          onFix={fix}
          worlds={worlds}
          countries={countries}
          names={names}
        />

        <ReadWhen month={mon} year={year} onMonth={setMon} onYear={setYear} />

        {themes.length > 0 && (
          <ThemeTicks
            themes={themes}
            ticks={ticks}
            onChange={setTicks}
            open={ticksOpen}
          />
        )}

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <LogActions
          editing={Boolean(book)}
          saving={saving}
          label={label}
          onRemove={remove}
          onClose={onClose}
        />
      </form>
    </Dialog>
  );
};

export default LogForm;
