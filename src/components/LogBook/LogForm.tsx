import { useMemo, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { PlusIcon, PushPinIcon, TrashIcon } from '@phosphor-icons/react';

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
import * as fieldStyles from '../Field/Field.css';
import Hint from '../Hint/Hint';
import Suggest from '../Suggest/Suggest';
import Select from '../Select/Select';
import Dialog from '../Dialog/Dialog';
import * as styles from './LogBook.css';
import MarkPreview from './MarkPreview';
import PlaceItem from './PlaceItem';
import ThenNote from './ThenNote';
import { type Row, row } from './placeRow';
import {
  duplicateOf,
  landingFor,
  PLACE_KEY,
  readLog,
  splitPlace,
} from './bookLog';

const MONTHS_IN_YEAR = 12;
// any year serves: only its month names are read
const SAMPLE_YEAR = 2000;
// the year menu reaches this many years back
const YEARS_BACK = 80;

const MAX_PLACES = 20;

const MONTHS = Array.from({ length: MONTHS_IN_YEAR }, (_unused, i) =>
  new Intl.DateTimeFormat(getLocale(), { month: 'long' }).format(
    new Date(SAMPLE_YEAR, i, 1)
  )
);

const YEARS = Array.from({ length: YEARS_BACK }, (_unused, i) =>
  String(new Date().getFullYear() - i)
);

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
    book?.places.length
      ? book.places.map((place) =>
          place.imagined
            ? row(place.name, '', true)
            : // a place saved as just its country shows as an empty name beside that country
              row(
                place.name === name(place.countryCode) ? '' : place.name,
                name(place.countryCode)
              )
        )
      : [world ? row(world, '', true) : row('', startCountry)]
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

  const setRow = (key: number, change: Partial<Row>) =>
    setRows((rs) =>
      rs.map((placeRow) =>
        placeRow.key === key ? { ...placeRow, ...change } : placeRow
      )
    );

  const FIELD: Record<string, [id: string, label: string]> = {
    title: ['f-title', m.log_f_title()],
    author: ['f-author', m.log_f_author()],
    country: ['f-country', m.log_f_country()],
  };

  const fieldOf = (key: string) =>
    FIELD[key] ?? [
      `pr-country-${key.slice(PLACE_KEY.length)}`,
      m.log_f_place(),
    ];

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const errs = log.errors;

    setErrors(errs);
    const bad = Object.keys(errs);

    if (bad.length || !log.draft) {
      setFormError(
        bad.length === 1
          ? errs[bad[0]]
          : m.log_fields_need({
              fields: m.count_field({ count: bad.length }),
              list: [...new Set(bad.map((errKey) => fieldOf(errKey)[1]))].join(
                ', '
              ),
            })
      );

      document.getElementById(fieldOf(bad[0])[0])?.focus();

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

  const preview = Object.entries(log.marks);

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

  // a place's name: a real place named after its country fills the country in, if it's still empty
  const handlePlaceNameValue = (placeRow: Row) => (value: string) => {
    const sp = !placeRow.imagined && splitPlace(value, names);

    setRow(placeRow.key, {
      name: value,
      ...(sp && !placeRow.country && { country: name(sp.code) }),
    });
  };

  const handlePlaceCountryValue = (placeRow: Row) => (value: string) => {
    setRow(placeRow.key, {
      country: value,
      open: false,
      ...(!splitStates(value) && { pick: '' }),
    });

    fix(`${PLACE_KEY}${placeRow.key}`);
  };

  // the last place is emptied rather than removed, so there's always a row to type in
  const handlePlaceRemove = (placeRow: Row) => () => {
    fix(`${PLACE_KEY}${placeRow.key}`);

    setRows((rs) =>
      rs.length === 1
        ? [row()]
        : rs.filter((other) => other.key !== placeRow.key)
    );

    document.querySelector<HTMLInputElement>(`.${styles.place} input`)?.focus();
  };

  const handlePlacePick = (placeRow: Row) => (code: string) => {
    setRow(placeRow.key, { pick: code, open: false });
    fix(`${PLACE_KEY}${placeRow.key}`);
  };

  const handlePlaceChoiceReopen = (placeRow: Row) => () =>
    setRow(placeRow.key, { open: true });

  const handleImaginedChange =
    (placeRow: Row) => (event: ChangeEvent<HTMLInputElement>) => {
      setRow(placeRow.key, { imagined: event.target.checked });
      fix(`${PLACE_KEY}${placeRow.key}`);
    };

  const handlePlaceAdd = () => {
    const newRow = row();

    setRows((rs) => [...rs, newRow]);

    requestAnimationFrame(() =>
      document.getElementById(`pr-name-${newRow.key}`)?.focus()
    );
  };

  const handleThemeTick =
    (themeId: number) => (event: ChangeEvent<HTMLInputElement>) =>
      setTicks((ticked) =>
        event.target.checked
          ? [...ticked, themeId]
          : ticked.filter((id) => id !== themeId)
      );

  /* ---------- lists ---------- */
  const renderMark = ([code, mark]: (typeof preview)[number]) => (
    <MarkPreview
      key={code}
      name={name(code)}
      set={mark.set}
      author={mark.author}
    />
  );

  const renderImagined = (place: (typeof imagined)[number]) => (
    <span key={place.key} className={styles.mark}>
      <i className={styles.dotImagined} aria-hidden="true" />
      {place.name}
      <span className={styles.markNote}> · {m.log_imagined_note()}</span>
    </span>
  );

  const renderPlace = (placeRow: Row) => (
    <PlaceItem
      key={placeRow.key}
      placeRow={placeRow}
      error={errors[`${PLACE_KEY}${placeRow.key}`]}
      empty={rows.length === 1 && !placeRow.name && !placeRow.country}
      worlds={worlds}
      countries={countries}
      names={names}
      onNameValue={handlePlaceNameValue(placeRow)}
      onCountryValue={handlePlaceCountryValue(placeRow)}
      onRemove={handlePlaceRemove(placeRow)}
      onPick={handlePlacePick(placeRow)}
      onChoiceReopen={handlePlaceChoiceReopen(placeRow)}
      onImaginedChange={handleImaginedChange(placeRow)}
    />
  );

  const renderTheme = (theme: Goal) => (
    <li key={theme.id}>
      <label>
        <input
          type="checkbox"
          checked={ticks.includes(theme.id)}
          onChange={handleThemeTick(theme.id)}
        />
        {theme.name}
      </label>
    </li>
  );

  // the month and year menus: "Month" / "Year" first, for a book read some time
  const monthOptions = [
    { value: '', label: m.log_month() },
    ...MONTHS.map((monthName, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: monthName,
    })),
  ];

  const yearOptions = [
    { value: '', label: m.log_year() },
    ...YEARS.map((yearOption) => ({ value: yearOption, label: yearOption })),
  ];

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
      {(preview.length > 0 || imagined.length > 0) && (
        <p className={styles.preview}>
          <span className={styles.label}>{m.log_will_mark()}</span>
          {preview.map(renderMark)}
          {imagined.map(renderImagined)}
        </p>
      )}

      <form onSubmit={submit} noValidate>
        <div className={fieldStyles.field} data-invalid={Boolean(errors.title)}>
          <label htmlFor="f-title" className={fieldStyles.fieldLabel}>
            {m.log_title()}
          </label>
          <input
            id="f-title"
            className={fieldStyles.input}
            autoComplete="off"
            maxLength={200}
            placeholder={m.log_title_ph()}
            value={title}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'f-title-err' : undefined}
            onChange={handleTitleChange}
          />
          {errors.title && (
            <div id="f-title-err" className={fieldStyles.fieldError}>
              {errors.title}
            </div>
          )}
        </div>

        <div
          className={fieldStyles.field}
          data-invalid={Boolean(errors.author)}
        >
          <label htmlFor="f-author" className={fieldStyles.fieldLabel}>
            {m.log_author()}
          </label>
          <input
            id="f-author"
            className={fieldStyles.input}
            autoComplete="off"
            maxLength={120}
            placeholder={m.log_author_ph()}
            value={author}
            aria-invalid={errors.author ? true : undefined}
            aria-describedby={errors.author ? 'f-author-err' : undefined}
            onChange={handleAuthorChange}
          />
          {errors.author && (
            <div id="f-author-err" className={fieldStyles.fieldError}>
              {errors.author}
            </div>
          )}
        </div>

        <div
          className={fieldStyles.field}
          data-invalid={Boolean(errors.country)}
        >
          <label htmlFor="f-country" className={fieldStyles.fieldLabel}>
            <i className={styles.dotAuthor} aria-hidden="true" />
            {m.log_country()}
          </label>
          <Suggest
            id="f-country"
            className={fieldStyles.input}
            autoComplete="off"
            options={countries}
            maxLength={60}
            placeholder={m.log_country_ph()}
            value={country}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={`${errors.country ? 'f-country-err ' : ''}f-country-note`}
            onValue={handleCountryValue}
          />
          <ThenNote
            typed={country}
            pick={authorPick}
            open={authorOpen}
            author
            names={names}
            onPick={handleAuthorPick}
            onChange={handleAuthorChoiceReopen}
          />
          {errors.country && (
            <div id="f-country-err" className={fieldStyles.fieldError}>
              {errors.country}
            </div>
          )}
          <Hint id="f-country-note">{m.log_country_hint()}</Hint>
        </div>

        <fieldset className={styles.set}>
          <legend className={fieldStyles.fieldLabel}>
            <i className={styles.dotSet} aria-hidden="true" />
            {m.log_places()}
          </legend>
          <Hint>{m.log_city_hint()}</Hint>
          <div className={styles.placesHead} aria-hidden="true">
            <span>{m.log_city()}</span>
            <span>{m.log_country_col()}</span>
          </div>
          <ul className={styles.places}>{rows.map(renderPlace)}</ul>
          {rows.length < MAX_PLACES && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={handlePlaceAdd}
            >
              <PlusIcon aria-hidden="true" />
              {m.log_add_place()}
            </button>
          )}
        </fieldset>

        <fieldset className={styles.set} aria-describedby="f-month-hint">
          <legend className={fieldStyles.fieldLabel}>{m.log_when()}</legend>
          <div className={styles.month}>
            <Select
              id="f-mon"
              label={m.log_month()}
              className={styles.monthPick}
              value={mon}
              onChange={setMon}
              options={monthOptions}
            />
            <Select
              id="f-year"
              label={m.log_year()}
              className={styles.yearPick}
              value={year}
              onChange={setYear}
              options={yearOptions}
            />
          </div>
          <Hint id="f-month-hint">{m.log_month_hint()}</Hint>
        </fieldset>

        {themes.length > 0 && (
          <fieldset className={styles.themes}>
            <legend className={styles.srOnly}>{m.log_themes()}</legend>
            <details open={ticksOpen}>
              <summary>
                {ticks.length
                  ? m.log_counts_toward({
                      goals: m.count_theme_goal({ count: ticks.length }),
                    })
                  : m.log_counts_q()}
              </summary>
              <ul>{themes.map(renderTheme)}</ul>
            </details>
          </fieldset>
        )}

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <div className={styles.actions}>
          {book ? (
            <>
              <button
                type="button"
                className={`${styles.linkBtn} ${styles.danger}`}
                disabled={saving}
                onClick={remove}
              >
                <TrashIcon aria-hidden="true" />
                {m.log_remove()}
              </button>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={onClose}
              >
                {m.common_cancel()}
              </button>
            </>
          ) : (
            <button type="button" className={styles.linkBtn} onClick={onClose}>
              {m.common_close()}
            </button>
          )}
          <button
            type="submit"
            className={styles.primary}
            disabled={saving}
            aria-busy={saving || undefined}
          >
            <PushPinIcon aria-hidden="true" />
            {label}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default LogForm;
