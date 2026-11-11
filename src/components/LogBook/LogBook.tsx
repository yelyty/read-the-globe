import { useEffect, useMemo, useRef, useState, type SubmitEvent } from 'react';
import {
  getRouteApi,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import {
  ArrowCounterClockwiseIcon,
  PlusIcon,
  PushPinIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { Feature } from 'geojson';
import { useStatus } from '../../hooks/useStatus';
import { useLanding, type Landing } from '../../hooks/useLanding';
import type { BookEntry, Goal, NextRead } from '../../types';
import { deleteBook, saveBook, type BookDraft } from '../../api/books/books';
import { removeNextRead } from '../../api/nextReads/nextReads';
import { worldShapes } from '../../utils/worldShapes';
import { atlasMarks } from '../../utils/atlasMarks';
import { pinMoment } from '../../utils/pinMoment';
import { worldsOf } from '../../utils/worlds';
import {
  countryFrom,
  splitStates,
  tidy,
  type CountryMatch,
} from '../../utils/countryFrom';
import { goalProgress, isDone, plural } from '../../pages/GoalsPage/goals';
import * as f from '../Field/Field.css';
import * as s from './LogBook.css';
import Hint from '../Hint/Hint';
import Suggest from '../Suggest/Suggest';
import { localToday, readDate, readOnFor } from '../../utils/readDate';

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

/* a place: a name and its country, or (imagined) a world's name and no country.
   pick: the country chosen for a state that split; open: its choice unfolded again by Change */
type Row = {
  key: number;
  name: string;
  country: string;
  imagined: boolean;
  pick: string;
  open: boolean;
};
let rowKey = 0;
const row = (name = '', country = '', imagined = false): Row => ({
  key: ++rowKey,
  name,
  country,
  imagined,
  pick: '',
  open: false,
});

const formatMonth = (day: string) =>
  day
    ? new Date(`${day}T12:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : '';

// ?country=<code> or ?world=<name> starts it with a place there (a click on the map, a world's Log a book set here).
const LogBook = () => {
  const status = useStatus();
  const { log, edit, next, country, world } = app.useSearch();
  const { books, goals, worlds } = app.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();
  const [shapes, setShapes] = useState<Record<string, Feature>>();
  const [said, setSaid] = useState('');
  const [, setLanding] = useLanding();
  // on the Shelf, ?country is also the country page, so it stays when the form closes
  const onShelf = useRouterState({
    select: (st) => st.matches.some((m) => m.routeId === '/app/shelf'),
  });
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

  // country names from the 50m map, the same list as the countries table (the 110m one misses small countries);
  // the shapes themselves size up a region goal, to tell whether this book reached it
  useEffect(() => {
    if (!open || shapes) return;
    worldShapes().then(setShapes);
  }, [open, shapes]);
  const names = useMemo(
    () =>
      shapes &&
      Object.fromEntries(
        Object.entries(shapes).map(([code, shape]) => [
          code,
          String(shape.properties?.name ?? ''),
        ])
      ),
    [shapes]
  );

  const close = () =>
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        log: undefined,
        edit: undefined,
        next: undefined,
        world: undefined,
        country: onShelf ? prev.country : undefined,
      }),
    });

  // a new book goes to Home to land on the atlas; an edit stays where it was
  const done = async (message: string, landing?: Landing) => {
    if (landing) {
      setLanding(landing);
      await navigate({ to: '/app', search: {} });
    } else await close();
    await router.invalidate();
    // Home says where the new book went when its pins land
    if (!landing) setSaid(message);
  };

  // Undo puts the book back through the same save as the form: a new row with the same title, author, places,
  // read date and goal ticks. ponytail: it counts as logged again, so it returns to the top of Recent reads
  const removed = async (gone: BookEntry) => {
    await close();
    await router.invalidate();
    status.show({
      text: `Removed ${gone.title} from your atlas.`,
      action: {
        label: 'Undo',
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const { error } = await saveBook({
            title: gone.title,
            author: gone.author?.name ?? '',
            authorCountry: gone.author?.country?.code ?? '',
            readOn: readDate(gone),
            places: gone.places.map((p) => ({
              name: p.name,
              country: p.imagined ? null : (p.countryCode ?? ''),
              imagined: p.imagined,
            })),
            goalIds: gone.goals.map((g) => g.goalId),
          });
          if (error) return status.show({ text: error });
          await router.invalidate();
          status.show({ text: `${gone.title} is back on your atlas.` });
        },
      },
    });
  };

  return (
    <>
      {open && shapes && names && (
        <LogForm
          key={edit ?? 'new'}
          book={book}
          nextItem={nextItem}
          setIn={country}
          world={world}
          shapes={shapes}
          names={names}
          books={books}
          goals={goals}
          worlds={worldsOf(books, worlds).map((w) => w.name)}
          onClose={close}
          onDone={done}
          onRemoved={removed}
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
  const dialog = useRef<HTMLDialogElement>(null);
  const name = (code?: string | null) => (code ? (names[code] ?? '') : '');
  const countries = useMemo(
    () => Object.values(names).sort((a, b) => a.localeCompare(b)),
    [names]
  );
  // "City, Country" in one go
  const split = (raw: string) => {
    const m = raw.match(/^(.*),\s*([^,]+)$/);
    const c = m && countryFrom(m[2], names);
    return m && c ? { name: m[1].trim(), code: c.code } : null;
  };

  const startYm = book ? readDate(book).slice(0, 7) : '';
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
  const [authorPick, setAuthorPick] = useState('');
  const [authorOpen, setAuthorOpen] = useState(false);
  // a place to start with: from a Next to read item, a click on the map, or a world's box
  const startCountry = name(
    nextItem?.mark === 'set' ? nextItem.countryCode : setIn
  );
  const [rows, setRows] = useState<Row[]>(() =>
    book?.places.length
      ? book.places.map((p) =>
          p.imagined
            ? row(p.name, '', true)
            : // a place saved as just its country shows as an empty name beside that country
              row(
                p.name === name(p.countryCode) ? '' : p.name,
                name(p.countryCode)
              )
        )
      : [world ? row(world, '', true) : row('', startCountry)]
  );
  const sub = book
    ? ''
    : world || startCountry
      ? `A book set in ${world || startCountry}?`
      : books.length
        ? ''
        : 'Pin the last book you loved.';
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
    .filter((r) => r.name.trim() || (!r.imagined && r.country.trim()))
    .map((r) => {
      if (r.imagined)
        return { key: r.key, name: tidy(r.name), imagined: true, typed: '' };
      const sp = split(r.name);
      const c: CountryMatch | null =
        countryFrom(r.country, names, r.pick) ??
        (sp ? { code: sp.code } : null);
      return {
        key: r.key,
        name: sp ? sp.name : r.name.trim(),
        imagined: false,
        match: c,
        code: c?.code,
        typed: r.country.trim(),
      };
    });
  const authorMatch = countryFrom(country, names, authorPick);
  const authorCode = authorMatch?.code;

  // what Pin it will mark, in words
  const marks: Record<string, { set?: boolean; author?: boolean }> = {};
  if (authorCode) marks[authorCode] = { author: true };
  for (const p of places)
    if (p.code) marks[p.code] = { ...marks[p.code], set: true };
  const imagined = places.filter((p) => p.imagined);

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
    splitStates(typed)
      ? `Choose which country ${tidy(typed)} is today.`
      : typed
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
      if (!p.code && !p.imagined)
        errs[`place-${p.key}`] = countryError(p.typed, true);
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
        `Already on your shelf since ${formatMonth(readDate(dup))}. Pin it again to add it a second time.`
      );
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
      places: places.map((p) =>
        p.imagined
          ? { name: p.name, country: null, imagined: true }
          : {
              name: p.name || p.match?.as || p.match?.then || name(p.code),
              country: p.code!,
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
      book ? `Saved ${title.trim()}.` : `Pinned ${title.trim()}.`,
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
      places: draft.places.map((p, i) => ({
        id: String(i),
        name: p.name,
        lon: 0,
        lat: 0,
        countryCode: p.country,
        bookId: id,
        imagined: p.imagined,
      })),
      goals: draft.goalIds.map((goalId) => ({ goalId })),
    };
    const all = [...books, added];
    const before = atlasMarks(books);
    const after = atlasMarks(all);
    // the Goals page stamps them when the reader goes to look
    const reached = goals.filter(
      (g) =>
        !g.reachedOn &&
        !isDone(goalProgress(g, before, books, shapes)) &&
        isDone(goalProgress(g, after, all, shapes))
    );
    const g = reached[0];
    const total = g && goalProgress(g, after, all, shapes).total;
    return {
      ...pinMoment(added, before, after, names),
      bookId: id,
      reached: g
        ? `Goal reached: ${g.name}, ${g.kind === 'theme' ? plural(total, 'book') : `all ${plural(total, 'country', 'countries')}`}.${reached.length > 1 ? ` And ${reached.length - 1} more.` : ''}`
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
          {sub && <p className={s.sub}>{sub}</p>}
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

      {(preview.length > 0 || imagined.length > 0) && (
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
          {imagined.map((p) => (
            <span key={p.key} className={s.mark}>
              <i className={s.dotImagined} aria-hidden="true" />
              {p.name}
              <span className={s.markNote}> · imagined, not on the map</span>
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
          <Suggest
            id="f-country"
            className={f.input}
            autoComplete="off"
            options={countries}
            maxLength={60}
            placeholder="Where are they from?"
            value={country}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={`${errors.country ? 'f-country-err ' : ''}f-country-note`}
            onValue={(v) => {
              setCountry(v);
              if (!splitStates(v)) setAuthorPick('');
              setAuthorOpen(false);
              fix('country');
            }}
          />
          <ThenNote
            typed={country}
            pick={authorPick}
            open={authorOpen}
            author
            names={names}
            onPick={(code) => {
              setAuthorPick(code);
              setAuthorOpen(false);
              fix('country');
            }}
            onChange={() => setAuthorOpen(true)}
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
                <li
                  key={r.key}
                  className={s.place}
                  data-imagined={r.imagined || undefined}
                >
                  <label className={s.srOnly} htmlFor={`pr-name-${r.key}`}>
                    Place
                  </label>
                  <Suggest
                    id={`pr-name-${r.key}`}
                    className={f.input}
                    autoComplete="off"
                    maxLength={80}
                    placeholder={
                      r.imagined ? 'Middle-earth, Earthsea…' : 'City or region'
                    }
                    // an imagined place offers the reader's worlds; ponytail: no gazetteer of real places yet
                    options={r.imagined ? worlds : []}
                    value={r.name}
                    onValue={(v) => {
                      const sp = !r.imagined && split(v);
                      setRow(r.key, {
                        name: v,
                        ...(sp && !r.country && { country: name(sp.code) }),
                      });
                    }}
                  />
                  {!r.imagined && (
                    <div data-invalid={Boolean(err)}>
                      <label
                        className={s.srOnly}
                        htmlFor={`pr-country-${r.key}`}
                      >
                        Country of that place
                      </label>
                      <Suggest
                        id={`pr-country-${r.key}`}
                        className={f.input}
                        autoComplete="off"
                        options={countries}
                        maxLength={60}
                        placeholder="Country"
                        value={r.country}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={
                          err ? `pr-country-${r.key}-err` : undefined
                        }
                        onValue={(v) => {
                          setRow(r.key, {
                            country: v,
                            open: false,
                            ...(!splitStates(v) && { pick: '' }),
                          });
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
                  )}
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
                  {!r.imagined && (
                    <ThenNote
                      typed={r.country}
                      pick={r.pick}
                      open={r.open}
                      names={names}
                      onPick={(code) => {
                        setRow(r.key, { pick: code, open: false });
                        fix(`place-${r.key}`);
                      }}
                      onChange={() => setRow(r.key, { open: true })}
                    />
                  )}
                  {/* an imagined world has no country: ticking it sets the country aside (kept, in case it's unticked) */}
                  <label className={s.imagined}>
                    <input
                      type="checkbox"
                      checked={r.imagined}
                      onChange={(e) => {
                        setRow(r.key, { imagined: e.target.checked });
                        fix(`place-${r.key}`);
                      }}
                    />
                    Not on any map (an imagined world)
                  </label>
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
    </dialog>
  );
};

type ThenNoteProps = {
  typed: string;
  pick: string;
  /** the choice unfolded again by Change */
  open: boolean;
  author?: boolean;
  names: Record<string, string>;
  onPick: (code: string) => void;
  onChange: () => void;
};

// Under a country field: what an old or dependent name counts as, and for a state that split, a choice of today's countries
const ThenNote = ({
  typed,
  pick,
  open,
  author,
  names,
  onPick,
  onChange,
}: ThenNoteProps) => {
  const note = useRef<HTMLDivElement>(null);
  // after a pick, focus goes to Change; after Change, to the chosen pill
  const focusIn = (selector: string) =>
    requestAnimationFrame(() =>
      note.current?.querySelector<HTMLElement>(selector)?.focus()
    );
  const name = tidy(typed);
  const states = splitStates(typed);
  const c = countryFrom(typed, names, pick);
  let content = null;
  if (states && c && !open)
    content = (
      <p>
        {name} is counted as <b>{names[c.code]}</b>.{' '}
        <button
          type="button"
          className={s.thenChange}
          onClick={() => {
            onChange();
            focusIn('[aria-pressed="true"], button');
          }}
        >
          Change
        </button>
      </p>
    );
  else if (states)
    content = (
      <>
        <p>
          {name} is {states.length} countries today.{' '}
          {author
            ? 'Which did the author live in?'
            : 'Which is this place in now?'}
        </p>
        <div className={s.thenPicks}>
          {states.map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={pick === code}
              onClick={() => {
                onPick(code);
                focusIn('button');
              }}
            >
              {names[code]}
            </button>
          ))}
        </div>
      </>
    );
  else if (c?.then)
    content = <p>Counted as {names[c.code]}, the country there today.</p>;
  else if (c?.as && c.under)
    content = (
      <p>
        {c.code === c.under
          ? `Counted under ${names[c.under]}.`
          : `Counted under ${names[c.under]}; ${c.as} fills in on the map too.`}
      </p>
    );
  return (
    <div ref={note} className={s.thenNote} aria-live="polite" hidden={!content}>
      {content}
    </div>
  );
};

export default LogBook;
