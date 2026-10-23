import { useEffect, useMemo, useRef, useState, type SubmitEvent } from 'react';
import {
  getRouteApi,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { PlusIcon, PushPinIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import type { BookEntry, Goal, NextRead } from '../../types';
import { deleteBook, saveBook } from '../../api/books/books';
import { removeNextRead } from '../../api/nextReads/nextReads';
import { worldShapes } from '../../utils/worldShapes';
import * as f from '../Field/Field.css';
import * as s from './LogBook.css';
import Hint from '../Hint/Hint';

const app = getRouteApi('/app');

const MAX_PLACES = 20;
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat(undefined, { month: 'long' }).format(
    new Date(2000, i, 1)
  )
);
const YEARS = Array.from({ length: 80 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

type Row = { key: number; name: string; country: string };
let rowKey = 0;
const row = (name = '', country = ''): Row => ({
  key: ++rowKey,
  name,
  country,
});

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

// The log form, as in the app mock: one dialog over any page (a bottom sheet on phones). ?log opens it,
// ?edit=<book id> opens it on that book, and ?next=<item id> starts it from a Next to read item.
const LogBook = () => {
  const { log, edit, next } = app.useSearch();
  const { books, goals } = app.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();
  const [names, setNames] = useState<Record<string, string>>();
  const [said, setSaid] = useState('');
  const book = edit ? books.find((b) => b.id === edit) : undefined;
  const open = Boolean(log || book);
  // the item "Log it" came from, from the Shelf's loader (the only place it can be pressed)
  const nextItem = useRouterState({
    select: (st) =>
      (
        st.matches.find((m) => m.routeId === '/app/shelf')?.loaderData as
          { items: NextRead[] } | undefined
      )?.items.find((it) => it.id === next),
  });

  // country names from the 50m map, the same list as the countries table (the 110m one misses small countries)
  useEffect(() => {
    if (!open || names) return;
    worldShapes().then((shapes) =>
      setNames(
        Object.fromEntries(
          Object.entries(shapes).map(([code, shape]) => [
            code,
            String(shape.properties?.name ?? ''),
          ])
        )
      )
    );
  }, [open, names]);

  const close = () =>
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        log: undefined,
        edit: undefined,
        next: undefined,
      }),
    });

  // a new book goes to Home to be seen on the atlas; an edit stays where it was
  const done = async (message: string, home: boolean) => {
    if (home) await navigate({ to: '/app', search: {} });
    else await close();
    await router.invalidate();
    setSaid(message);
  };

  return (
    <>
      {open && names && (
        <LogForm
          key={edit ?? 'new'}
          book={book}
          nextItem={nextItem}
          names={names}
          books={books}
          goals={goals}
          onClose={close}
          onDone={done}
        />
      )}
      <p className={s.srOnly} role="status">
        {said}
      </p>
    </>
  );
};

type LogFormProps = {
  book?: BookEntry;
  nextItem?: NextRead;
  names: Record<string, string>;
  books: BookEntry[];
  goals: Goal[];
  onClose: () => void;
  onDone: (message: string, home: boolean) => void;
};

const LogForm = ({
  book,
  nextItem,
  names,
  books,
  goals,
  onClose,
  onDone,
}: LogFormProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const name = (code?: string | null) => (code ? (names[code] ?? '') : '');
  const byName = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(names).map(([code, n]) => [n.toLowerCase(), code])
      ),
    [names]
  );
  const codeOf = (typed: string): string | undefined =>
    byName[typed.trim().toLowerCase()];
  // "City, Country" in one go
  const split = (raw: string) => {
    const m = raw.match(/^(.*),\s*([^,]+)$/);
    const code = m ? codeOf(m[2]) : undefined;
    return m && code ? { name: m[1].trim(), code } : null;
  };

  const startYm = book?.createdAt?.slice(0, 7) ?? '';
  const themes = goals.filter((g) => g.kind === 'theme');
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
  const [rows, setRows] = useState<Row[]>(() =>
    book?.places.length
      ? book.places.map((p) =>
          // a place saved as just its country shows as an empty name beside that country
          row(p.name === name(p.countryCode) ? '' : p.name, name(p.countryCode))
        )
      : [row('', nextItem?.mark === 'set' ? name(nextItem.countryCode) : '')]
  );
  const [mon, setMon] = useState(startYm.slice(5, 7));
  const [year, setYear] = useState(startYm.slice(0, 4));
  const [ticks, setTicks] = useState<number[]>(
    () =>
      book?.goals
        ?.map((g) => g.goalId)
        .filter((id) => themes.some((t) => t.id === id)) ?? []
  );
  // the goal ticks start open only if the book already counts toward one; after that the reader folds them
  const [ticksOpen] = useState(ticks.length > 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [dupOk, setDupOk] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById('f-title')?.focus();
  }, []);

  const places = rows
    .filter((r) => r.name.trim() || r.country.trim())
    .map((r) => {
      const sp = split(r.name);
      return {
        key: r.key,
        name: sp ? sp.name : r.name.trim(),
        code: codeOf(r.country) ?? sp?.code,
        typed: r.country.trim(),
      };
    });
  const authorCode = codeOf(country);

  // what Pin it will mark, in words
  const marks: Record<string, { set?: boolean; author?: boolean }> = {};
  if (authorCode) marks[authorCode] = { author: true };
  for (const p of places)
    if (p.code) marks[p.code] = { ...marks[p.code], set: true };

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
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...change } : r)));

  const countryError = (typed: string, place: boolean) =>
    typed
      ? `No country called “${typed}”. Pick one from the list.`
      : place
        ? 'Add the country this place is in.'
        : 'Add the country the author is from.';
  const FIELD: Record<string, [id: string, label: string]> = {
    title: ['f-title', 'title'],
    author: ['f-author', 'author'],
    country: ['f-country', 'author’s country'],
  };
  const fieldOf = (key: string) =>
    FIELD[key] ?? [`pr-country-${key.slice(6)}`, 'a place’s country'];

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Add the book’s title.';
    if (!author.trim()) errs.author = 'Add the author’s name.';
    if (!authorCode) errs.country = countryError(country.trim(), false);
    for (const p of places)
      if (!p.code) errs[`place-${p.key}`] = countryError(p.typed, true);
    setErrors(errs);
    const bad = Object.keys(errs);
    if (bad.length) {
      setFormError(
        bad.length === 1
          ? errs[bad[0]]
          : `${bad.length} fields need a look: ${[...new Set(bad.map((k) => fieldOf(k)[1]))].join(', ')}.`
      );
      document.getElementById(fieldOf(bad[0])[0])?.focus();
      return;
    }

    // the same book twice is usually a slip: say so once, then let a second Pin it through
    const key = `${title.trim()}|${author.trim()}`.toLowerCase();
    const dup =
      !book &&
      books.find(
        (b) => `${b.title}|${b.author?.name ?? ''}`.toLowerCase() === key
      );
    if (dup && dupOk !== key) {
      setDupOk(key);
      setFormError(
        `Already on your shelf since ${formatDate(dup.createdAt)}. Pin it again to add it a second time.`
      );
      return;
    }

    // ponytail: the read month is stored as the book's created_at (what Home and the Shelf already sort by);
    // a read_on column if "recently logged" and "read" ever need to differ. Day 1 at noon UTC shows that month in every timezone.
    const now = new Date().toISOString();
    const ym = mon || year ? `${year || now.slice(0, 4)}-${mon || '01'}` : '';
    const readOn =
      !ym || ym === startYm
        ? null
        : ym === now.slice(0, 7)
          ? new Date().toISOString()
          : `${ym}-01T12:00:00Z`;

    setSaving(true);
    const error = await saveBook(
      {
        title: title.trim(),
        author: author.trim(),
        authorCountry: authorCode!,
        readOn,
        places: places.map((p) => ({
          name: p.name || name(p.code),
          country: p.code!,
        })),
        goalIds: ticks,
      },
      book?.id
    );
    if (error) {
      setSaving(false);
      setFormError(error);
      return;
    }
    // ponytail: if this fails the item just stays on Next to read; the book is saved either way
    if (!book && nextItem) await removeNextRead(nextItem.id);
    onDone(book ? `Saved ${title.trim()}.` : `Pinned ${title.trim()}.`, !book);
  };

  // ponytail: a confirm until there's a toast with Undo (REACT-TODO 12.12)
  const remove = async () => {
    if (!book || !window.confirm(`Remove “${book.title}” from your atlas?`))
      return;
    setSaving(true);
    const error = await deleteBook(book.id);
    if (error) {
      setSaving(false);
      setFormError(error);
      return;
    }
    onDone(`Removed ${book.title} from your atlas.`, false);
  };

  const preview = Object.entries(marks);
  const label = saving
    ? book
      ? 'Saving…'
      : 'Pinning…'
    : book
      ? 'Save changes'
      : dupOk
        ? 'Pin it again'
        : 'Pin it';

  return (
    <dialog
      ref={dialog}
      className={s.sheet}
      data-editing={Boolean(book)}
      aria-labelledby="log-title"
      onClose={onClose}
    >
      <div className={s.head}>
        <div>
          <h2 id="log-title" className={s.title}>
            {book ? 'Editing' : 'Log a book'}
          </h2>
          {book && <p className={s.editing}>{book.title}</p>}
          {!book && !books.length && (
            <p className={s.sub}>Pin the last book you loved.</p>
          )}
        </div>
        <button
          type="button"
          className={s.close}
          aria-label="Close"
          onClick={onClose}
        >
          <XIcon aria-hidden="true" />
        </button>
      </div>

      {preview.length > 0 && (
        <p className={s.preview}>
          <span className={s.label}>Will mark</span>
          {preview.map(([code, m]) => (
            <span key={code} className={s.mark}>
              <i
                className={
                  m.set && m.author ? s.swatch : m.set ? s.dotSet : s.dotAuthor
                }
                aria-hidden="true"
              />
              {name(code)}
              <span className={s.srOnly}>
                ,{' '}
                {m.set && m.author
                  ? 'where it is set and where its author is from'
                  : m.set
                    ? 'where it is set'
                    : 'where its author is from'}
              </span>
            </span>
          ))}
        </p>
      )}

      <form onSubmit={submit} noValidate>
        <div className={f.field} data-invalid={Boolean(errors.title)}>
          <label htmlFor="f-title" className={f.fieldLabel}>
            Title
          </label>
          <input
            id="f-title"
            className={f.input}
            autoComplete="off"
            maxLength={200}
            placeholder="What is it called?"
            value={title}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'f-title-err' : undefined}
            onChange={(e) => {
              setTitle(e.target.value);
              fix('title');
              forgetDup();
            }}
          />
          {errors.title && (
            <div id="f-title-err" className={f.fieldError}>
              {errors.title}
            </div>
          )}
        </div>

        <div className={f.field} data-invalid={Boolean(errors.author)}>
          <label htmlFor="f-author" className={f.fieldLabel}>
            Author
          </label>
          <input
            id="f-author"
            className={f.input}
            autoComplete="off"
            maxLength={120}
            placeholder="Who wrote it?"
            value={author}
            aria-invalid={errors.author ? true : undefined}
            aria-describedby={errors.author ? 'f-author-err' : undefined}
            onChange={(e) => {
              setAuthor(e.target.value);
              fix('author');
              forgetDup();
            }}
          />
          {errors.author && (
            <div id="f-author-err" className={f.fieldError}>
              {errors.author}
            </div>
          )}
        </div>

        <div className={f.field} data-invalid={Boolean(errors.country)}>
          <label htmlFor="f-country" className={f.fieldLabel}>
            <i className={s.dotAuthor} aria-hidden="true" />
            Author’s country
          </label>
          <input
            id="f-country"
            className={f.input}
            autoComplete="off"
            list="log-countries"
            maxLength={60}
            placeholder="Where are they from?"
            value={country}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={`${errors.country ? 'f-country-err ' : ''}f-country-note`}
            onChange={(e) => {
              setCountry(e.target.value);
              fix('country');
            }}
          />
          {errors.country && (
            <div id="f-country-err" className={f.fieldError}>
              {errors.country}
            </div>
          )}
          <Hint id="f-country-note">
            Lived in more than one? Choose the country where they lived most of
            their life.
          </Hint>
        </div>

        <fieldset className={s.set}>
          <legend className={f.fieldLabel}>
            <i className={s.dotSet} aria-hidden="true" />
            Places in the book
          </legend>
          <Hint>
            A city or region, or “City, Country” in one go. Each place marks its
            country.
          </Hint>
          <div className={s.placesHead} aria-hidden="true">
            <span>City or region</span>
            <span>Country</span>
          </div>
          <ul className={s.places}>
            {rows.map((r) => {
              const err = errors[`place-${r.key}`];
              const empty = rows.length === 1 && !r.name && !r.country;
              return (
                <li key={r.key} className={s.place}>
                  <label className={s.srOnly} htmlFor={`pr-name-${r.key}`}>
                    Place
                  </label>
                  <input
                    id={`pr-name-${r.key}`}
                    className={f.input}
                    autoComplete="off"
                    maxLength={80}
                    placeholder="City or region"
                    value={r.name}
                    onChange={(e) => {
                      const sp = split(e.target.value);
                      setRow(r.key, {
                        name: e.target.value,
                        ...(sp && !r.country && { country: name(sp.code) }),
                      });
                    }}
                  />
                  <div data-invalid={Boolean(err)}>
                    <label className={s.srOnly} htmlFor={`pr-country-${r.key}`}>
                      Country of that place
                    </label>
                    <input
                      id={`pr-country-${r.key}`}
                      className={f.input}
                      autoComplete="off"
                      list="log-countries"
                      maxLength={60}
                      placeholder="Country"
                      value={r.country}
                      aria-invalid={err ? true : undefined}
                      aria-describedby={
                        err ? `pr-country-${r.key}-err` : undefined
                      }
                      onChange={(e) => {
                        setRow(r.key, { country: e.target.value });
                        fix(`place-${r.key}`);
                      }}
                    />
                    {err && (
                      <div
                        id={`pr-country-${r.key}-err`}
                        className={f.fieldError}
                      >
                        {err}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={s.close}
                    aria-label="Remove this place"
                    hidden={empty}
                    onClick={() => {
                      fix(`place-${r.key}`);
                      setRows((rs) =>
                        rs.length === 1
                          ? [row()]
                          : rs.filter((x) => x.key !== r.key)
                      );
                      document
                        .querySelector<HTMLInputElement>(`.${s.place} input`)
                        ?.focus();
                    }}
                  >
                    <XIcon aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          {rows.length < MAX_PLACES && (
            <button
              type="button"
              className={s.linkBtn}
              onClick={() => {
                const r = row();
                setRows((rs) => [...rs, r]);
                requestAnimationFrame(() =>
                  document.getElementById(`pr-name-${r.key}`)?.focus()
                );
              }}
            >
              <PlusIcon aria-hidden="true" />
              Add another place
            </button>
          )}
        </fieldset>

        <fieldset className={s.set} aria-describedby="f-month-hint">
          <legend className={f.fieldLabel}>When you read it</legend>
          <div className={s.month}>
            <label className={s.srOnly} htmlFor="f-mon">
              Month
            </label>
            <select
              id="f-mon"
              className={f.input}
              value={mon}
              onChange={(e) => setMon(e.target.value)}
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, '0')}>
                  {m}
                </option>
              ))}
            </select>
            <label className={s.srOnly} htmlFor="f-year">
              Year
            </label>
            <select
              id="f-year"
              className={f.input}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Hint id="f-month-hint">
            Month and year. Leave it empty and today’s date is used.
          </Hint>
        </fieldset>

        {themes.length > 0 && (
          <fieldset className={s.themes}>
            <legend className={s.srOnly}>
              Theme goals this book counts toward
            </legend>
            <details open={ticksOpen}>
              <summary>
                {ticks.length
                  ? `Counts toward ${ticks.length} theme ${ticks.length === 1 ? 'goal' : 'goals'}`
                  : 'Counts toward a theme goal?'}
              </summary>
              <ul>
                {themes.map((g) => (
                  <li key={g.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={ticks.includes(g.id)}
                        onChange={(e) =>
                          setTicks((t) =>
                            e.target.checked
                              ? [...t, g.id]
                              : t.filter((id) => id !== g.id)
                          )
                        }
                      />
                      {g.name}
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </fieldset>
        )}

        {formError && (
          <p className={s.formError} role="alert">
            {formError}
          </p>
        )}

        <div className={s.actions}>
          {book ? (
            <>
              <button
                type="button"
                className={`${s.linkBtn} ${s.danger}`}
                disabled={saving}
                onClick={remove}
              >
                <TrashIcon aria-hidden="true" />
                Remove from atlas
              </button>
              <button type="button" className={s.linkBtn} onClick={onClose}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className={s.linkBtn} onClick={onClose}>
              Close
            </button>
          )}
          <button
            type="submit"
            className={s.primary}
            disabled={saving}
            aria-busy={saving || undefined}
          >
            <PushPinIcon aria-hidden="true" />
            {label}
          </button>
        </div>
      </form>

      <datalist id="log-countries">
        {Object.values(names)
          .sort((a, b) => a.localeCompare(b))
          .map((n) => (
            <option key={n} value={n} />
          ))}
      </datalist>
    </dialog>
  );
};

export default LogBook;
