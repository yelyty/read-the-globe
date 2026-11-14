import { useMemo, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { PlusIcon, PushPinIcon, TrashIcon } from '@phosphor-icons/react';
import type { Feature } from 'geojson';

import { type Landing } from '../../hooks/useLanding';
import type { BookEntry, Goal, NextRead } from '../../types';
import { deleteBook, saveBook, type BookDraft } from '../../api/books/books';
import { removeNextRead } from '../../api/nextReads/nextReads';
import { atlasMarks } from '../../utils/atlasMarks';
import { pinMoment } from '../../utils/pinMoment';
import {
  countryFrom,
  splitStates,
  tidy,
  type CountryMatch,
} from '../../utils/countryFrom';
import { goalProgress, isDone } from '../../pages/goals/goals';
import { localToday, readDate, readOnFor } from '../../utils/readDate';
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

const MONTHS_IN_YEAR = 12;
// any year serves: only its month names are read
const SAMPLE_YEAR = 2000;
// the year menu reaches this many years back
const YEARS_BACK = 80;
// a place's error is filed under its row: 'place-<key>'
const PLACE_KEY = 'place-';

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
  shapes: Record<string, Feature>;
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
  shapes,
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

  // "City, Country" in one go
  const split = (raw: string) => {
    const hit = raw.match(/^(.*),\s*([^,]+)$/);
    const match = hit && countryFrom(hit[2], names);

    return hit && match ? { name: hit[1].trim(), code: match.code } : null;
  };

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

  const places = rows
    .filter(
      (placeRow) =>
        placeRow.name.trim() || (!placeRow.imagined && placeRow.country.trim())
    )
    .map((placeRow) => {
      if (placeRow.imagined)
        return {
          key: placeRow.key,
          name: tidy(placeRow.name),
          imagined: true,
          typed: '',
        };
      const sp = split(placeRow.name);

      const match: CountryMatch | null =
        countryFrom(placeRow.country, names, placeRow.pick) ??
        (sp ? { code: sp.code } : null);

      return {
        key: placeRow.key,
        name: sp ? sp.name : placeRow.name.trim(),
        imagined: false,
        match: match,
        code: match?.code,
        typed: placeRow.country.trim(),
      };
    });

  const authorMatch = countryFrom(country, names, authorPick);
  const authorCode = authorMatch?.code;

  // what Pin it will mark, in words
  const marks: Record<string, { set?: boolean; author?: boolean }> = {};

  if (authorCode) marks[authorCode] = { author: true };
  for (const place of places)
    if (place.code) marks[place.code] = { ...marks[place.code], set: true };
  const imagined = places.filter((place) => place.imagined);

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

  const countryError = (typed: string, place: boolean) =>
    splitStates(typed)
      ? m.log_choose_today({ name: tidy(typed) })
      : typed
        ? m.log_no_country({ typed })
        : place
          ? m.log_add_place_country()
          : m.log_add_author_country();

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
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = m.log_need_title();
    if (!author.trim()) errs.author = m.log_need_author();
    if (!authorCode) errs.country = countryError(country.trim(), false);
    for (const place of places)
      if (!place.code && !place.imagined)
        errs[`${PLACE_KEY}${place.key}`] = countryError(place.typed, true);
    setErrors(errs);
    const bad = Object.keys(errs);

    if (bad.length) {
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

    // the same book twice is usually a slip: say so once, then let a second Pin it through
    const key = `${title.trim()}|${author.trim()}`.toLowerCase();

    const dup =
      !book &&
      books.find(
        (entry) =>
          `${entry.title}|${entry.author?.name ?? ''}`.toLowerCase() === key
      );

    if (dup && dupOk !== key) {
      setDupOk(key);
      setFormError(m.log_dup({ month: formatMonth(readDate(dup)) }));

      return;
    }

    // the read month goes to read_on; created_at stays the day it was logged (Home's Recent reads)
    const readOn = readOnFor(mon, year, startYm, localToday());

    // ponytail: an old name or a territory isn't kept beside the country; it only names an unnamed place
    const draft: BookDraft = {
      title: title.trim(),
      author: author.trim(),
      authorCountry: authorCode!,
      readOn,
      places: places.map((place) =>
        place.imagined
          ? { name: place.name, country: null, imagined: true }
          : {
              name:
                place.name ||
                place.match?.as ||
                place.match?.then ||
                name(place.code),
              country: place.code!,
            }
      ),
      goalIds: ticks,
    };

    setSaving(true);
    const { id, error } = await saveBook(draft, book?.id);

    if (error || !id) {
      setSaving(false);
      setFormError(error ?? '');

      return;
    }

    if (!book && nextItem) await removeNextRead(nextItem.id);

    onDone(
      book
        ? m.log_saved({ title: title.trim() })
        : m.log_pinned({ title: title.trim() }),
      book ? undefined : landing(id, draft)
    );
  };

  // where the new book lands on Home, and whether it carried a goal over its flag
  const landing = (id: string, draft: BookDraft): Landing => {
    const added: BookEntry = {
      id,
      title: draft.title,
      author: {
        name: draft.author,
        country: { code: draft.authorCountry, name: name(draft.authorCountry) },
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
    };

    const all = [...books, added];
    const before = atlasMarks(books);
    const after = atlasMarks(all);

    // the Goals page stamps them when the reader goes to look
    const reached = goals.filter(
      (goal) =>
        !goal.reachedOn &&
        !isDone(goalProgress(goal, before, books, shapes)) &&
        isDone(goalProgress(goal, after, all, shapes))
    );

    const firstGoal = reached[0];

    const total =
      firstGoal && goalProgress(firstGoal, after, all, shapes).total;

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

  const preview = Object.entries(marks);

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
    const sp = !placeRow.imagined && split(value);

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
