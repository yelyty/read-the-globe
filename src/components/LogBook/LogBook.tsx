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
import { goalProgress, isDone } from '../../pages/GoalsPage/goals';
import * as fieldStyles from '../Field/Field.css';
import * as styles from './LogBook.css';
import Hint from '../Hint/Hint';
import Suggest from '../Suggest/Suggest';
import { localToday, readDate, readOnFor } from '../../utils/readDate';
import { getCountryNames } from '../../utils/countryNames';
import { toAlpha2 } from '../../utils/toIsoNumeric';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';

const app = getRouteApi('/app');

const MAX_PLACES = 20;

const MONTHS = Array.from({ length: 12 }, (_unused, i) =>
  new Intl.DateTimeFormat(getLocale(), { month: 'long' }).format(
    new Date(2000, i, 1)
  )
);

const YEARS = Array.from({ length: 80 }, (_unused, i) =>
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
    ? new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
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
    select: (st) => st.matches.some((mt) => mt.routeId === '/app/shelf'),
  });

  const book = edit ? books.find((entry) => entry.id === edit) : undefined;
  const open = Boolean(log || book);

  // the item "Log it" came from, from the Shelf's loader (the only place it can be pressed)
  const nextItem = useRouterState({
    select: (st) =>
      (
        st.matches.find((mt) => mt.routeId === '/app/shelf')?.loaderData as
          { items: NextRead[] } | undefined
      )?.items.find((it) => it.id === next),
  });

  // country names from the 50m map, the same list as the countries table (the 110m one misses small countries);
  // the shapes themselves size up a region goal, to tell whether this book reached it
  useEffect(() => {
    if (!open || shapes) return;
    worldShapes().then(setShapes);
    // the English names, so a country typed in English still matches in Czech or Ukrainian
    void getCountryNames();
  }, [open, shapes]);

  const names = useMemo(() => {
    if (!shapes) return undefined;
    let dn: Intl.DisplayNames | null = null;

    try {
      if (getLocale() !== 'en')
        dn = new Intl.DisplayNames([getLocale()], { type: 'region' });
    } catch {
      // an old browser: the map's English names
    }

    // in the reader's language where the browser knows the country, else the map's English name
    return Object.fromEntries(
      Object.entries(shapes).map(([code, shape]) => {
        const a2 = toAlpha2(code);
        const local = a2 && dn?.of(a2);

        return [
          code,
          local && local !== a2 ? local : String(shape.properties?.name ?? ''),
        ];
      })
    );
  }, [shapes]);

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
      text: m.log_removed({ title: gone.title }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const { error } = await saveBook({
            title: gone.title,
            author: gone.author?.name ?? '',
            authorCountry: gone.author?.country?.code ?? '',
            readOn: readDate(gone),
            places: gone.places.map((place) => ({
              name: place.name,
              country: place.imagined ? null : (place.countryCode ?? ''),
              imagined: place.imagined,
            })),
            goalIds: gone.goals.map((goal) => goal.goalId),
          });

          if (error) return status.show({ text: error });
          await router.invalidate();
          status.show({ text: m.log_back({ title: gone.title }) });
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
          worlds={worldsOf(books, worlds).map((worldEntry) => worldEntry.name)}
          onClose={close}
          onDone={done}
          onRemoved={removed}
        />
      )}
      <p className={styles.srOnly} role="status">
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

  const startYm = book ? readDate(book).slice(0, 7) : '';
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

  const [mon, setMon] = useState(startYm.slice(5, 7));
  const [year, setYear] = useState(startYm.slice(0, 4));

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

  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById('f-title')?.focus();
  }, []);

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
    FIELD[key] ?? [`pr-country-${key.slice(6)}`, m.log_f_place()];

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = m.log_need_title();
    if (!author.trim()) errs.author = m.log_need_author();
    if (!authorCode) errs.country = countryError(country.trim(), false);
    for (const place of places)
      if (!place.code && !place.imagined)
        errs[`place-${place.key}`] = countryError(place.typed, true);
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

  return (
    <dialog
      ref={dialog}
      className={styles.sheet}
      data-editing={Boolean(book)}
      aria-labelledby="log-title"
      onClose={onClose}
    >
      <div className={styles.head}>
        <div>
          <h2 id="log-title" className={styles.title}>
            {book ? m.log_editing() : m.log_a_book()}
          </h2>
          {book && <p className={styles.editing}>{book.title}</p>}
          {sub && <p className={styles.sub}>{sub}</p>}
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label={m.common_close()}
          onClick={onClose}
        >
          <XIcon aria-hidden="true" />
        </button>
      </div>

      {(preview.length > 0 || imagined.length > 0) && (
        <p className={styles.preview}>
          <span className={styles.label}>{m.log_will_mark()}</span>
          {preview.map(([code, mk]) => (
            <span key={code} className={styles.mark}>
              <i
                className={
                  mk.set && mk.author
                    ? styles.swatch
                    : mk.set
                      ? styles.dotSet
                      : styles.dotAuthor
                }
                aria-hidden="true"
              />
              {name(code)}
              <span className={styles.srOnly}>
                ,{' '}
                {mk.set && mk.author
                  ? m.log_mark_both()
                  : mk.set
                    ? m.log_mark_set()
                    : m.log_mark_author()}
              </span>
            </span>
          ))}
          {imagined.map((place) => (
            <span key={place.key} className={styles.mark}>
              <i className={styles.dotImagined} aria-hidden="true" />
              {place.name}
              <span className={styles.markNote}>
                {' '}
                · {m.log_imagined_note()}
              </span>
            </span>
          ))}
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
            onChange={(changeEvent) => {
              setTitle(changeEvent.target.value);
              fix('title');
              forgetDup();
            }}
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
            onChange={(changeEvent) => {
              setAuthor(changeEvent.target.value);
              fix('author');
              forgetDup();
            }}
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
            onValue={(value) => {
              setCountry(value);
              if (!splitStates(value)) setAuthorPick('');
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
          <ul className={styles.places}>
            {rows.map((placeRow) => {
              const err = errors[`place-${placeRow.key}`];

              const empty =
                rows.length === 1 && !placeRow.name && !placeRow.country;

              return (
                <li
                  key={placeRow.key}
                  className={styles.place}
                  data-imagined={placeRow.imagined || undefined}
                >
                  <label
                    className={styles.srOnly}
                    htmlFor={`pr-name-${placeRow.key}`}
                  >
                    {m.log_place()}
                  </label>
                  <Suggest
                    id={`pr-name-${placeRow.key}`}
                    className={fieldStyles.input}
                    autoComplete="off"
                    maxLength={80}
                    placeholder={
                      placeRow.imagined ? m.log_world_ph() : m.log_city()
                    }
                    // an imagined place offers the reader's worlds; ponytail: no gazetteer of real places yet
                    options={placeRow.imagined ? worlds : []}
                    value={placeRow.name}
                    onValue={(value) => {
                      const sp = !placeRow.imagined && split(value);

                      setRow(placeRow.key, {
                        name: value,
                        ...(sp &&
                          !placeRow.country && { country: name(sp.code) }),
                      });
                    }}
                  />
                  {!placeRow.imagined && (
                    <div data-invalid={Boolean(err)}>
                      <label
                        className={styles.srOnly}
                        htmlFor={`pr-country-${placeRow.key}`}
                      >
                        {m.log_place_country()}
                      </label>
                      <Suggest
                        id={`pr-country-${placeRow.key}`}
                        className={fieldStyles.input}
                        autoComplete="off"
                        options={countries}
                        maxLength={60}
                        placeholder={m.log_country_col()}
                        value={placeRow.country}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={
                          err ? `pr-country-${placeRow.key}-err` : undefined
                        }
                        onValue={(value) => {
                          setRow(placeRow.key, {
                            country: value,
                            open: false,
                            ...(!splitStates(value) && { pick: '' }),
                          });

                          fix(`place-${placeRow.key}`);
                        }}
                      />
                      {err && (
                        <div
                          id={`pr-country-${placeRow.key}-err`}
                          className={fieldStyles.fieldError}
                        >
                          {err}
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.close}
                    aria-label={m.log_remove_place()}
                    hidden={empty}
                    onClick={() => {
                      fix(`place-${placeRow.key}`);

                      setRows((rs) =>
                        rs.length === 1
                          ? [row()]
                          : rs.filter((other) => other.key !== placeRow.key)
                      );

                      document
                        .querySelector<HTMLInputElement>(
                          `.${styles.place} input`
                        )
                        ?.focus();
                    }}
                  >
                    <XIcon aria-hidden="true" />
                  </button>
                  {!placeRow.imagined && (
                    <ThenNote
                      typed={placeRow.country}
                      pick={placeRow.pick}
                      open={placeRow.open}
                      names={names}
                      onPick={(code) => {
                        setRow(placeRow.key, { pick: code, open: false });
                        fix(`place-${placeRow.key}`);
                      }}
                      onChange={() => setRow(placeRow.key, { open: true })}
                    />
                  )}
                  {/* an imagined world has no country: ticking it sets the country aside (kept, in case it's unticked) */}
                  <label className={styles.imagined}>
                    <input
                      type="checkbox"
                      checked={placeRow.imagined}
                      onChange={(changeEvent) => {
                        setRow(placeRow.key, {
                          imagined: changeEvent.target.checked,
                        });

                        fix(`place-${placeRow.key}`);
                      }}
                    />
                    {m.log_imagined()}
                  </label>
                </li>
              );
            })}
          </ul>
          {rows.length < MAX_PLACES && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                const newRow = row();

                setRows((rs) => [...rs, newRow]);

                requestAnimationFrame(() =>
                  document.getElementById(`pr-name-${newRow.key}`)?.focus()
                );
              }}
            >
              <PlusIcon aria-hidden="true" />
              {m.log_add_place()}
            </button>
          )}
        </fieldset>

        <fieldset className={styles.set} aria-describedby="f-month-hint">
          <legend className={fieldStyles.fieldLabel}>{m.log_when()}</legend>
          <div className={styles.month}>
            <label className={styles.srOnly} htmlFor="f-mon">
              {m.log_month()}
            </label>
            <select
              id="f-mon"
              className={fieldStyles.input}
              value={mon}
              onChange={(changeEvent) => setMon(changeEvent.target.value)}
            >
              <option value="">{m.log_month()}</option>
              {MONTHS.map((mo, i) => (
                <option key={mo} value={String(i + 1).padStart(2, '0')}>
                  {mo}
                </option>
              ))}
            </select>
            <label className={styles.srOnly} htmlFor="f-year">
              {m.log_year()}
            </label>
            <select
              id="f-year"
              className={fieldStyles.input}
              value={year}
              onChange={(changeEvent) => setYear(changeEvent.target.value)}
            >
              <option value="">{m.log_year()}</option>
              {YEARS.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </select>
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
              <ul>
                {themes.map((theme) => (
                  <li key={theme.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={ticks.includes(theme.id)}
                        onChange={(changeEvent) =>
                          setTicks((ticked) =>
                            changeEvent.target.checked
                              ? [...ticked, theme.id]
                              : ticked.filter((id) => id !== theme.id)
                          )
                        }
                      />
                      {theme.name}
                    </label>
                  </li>
                ))}
              </ul>
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
    </dialog>
  );
};

// a translated sentence with one word in bold: the message is filled with a marker where the word goes
const BOLD = '\u0000';

const Bold = ({ text, bold }: { text: string; bold: string }) => {
  const [before, after = ''] = text.split(BOLD);

  return (
    <>
      {before}
      <b>{bold}</b>
      {after}
    </>
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
  const match = countryFrom(typed, names, pick);
  let content = null;

  if (states && match && !open)
    content = (
      <p>
        <Bold
          text={m.log_then_counted({ name, country: BOLD })}
          bold={names[match.code]}
        />{' '}
        <button
          type="button"
          className={styles.thenChange}
          onClick={() => {
            onChange();
            focusIn('[aria-pressed="true"], button');
          }}
        >
          {m.common_change()}
        </button>
      </p>
    );
  else if (states)
    content = (
      <>
        <p>
          {m.log_then_today({
            name,
            countries: m.count_country({ count: states.length }),
          })}{' '}
          {author ? m.log_then_author() : m.log_then_place()}
        </p>
        <div className={styles.thenPicks}>
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
  else if (match?.then)
    content = <p>{m.log_then_as({ country: names[match.code] })}</p>;
  else if (match?.as && match.under)
    content = (
      <p>
        {match.code === match.under
          ? m.log_then_under({ country: names[match.under] })
          : m.log_then_under_fill({
              country: names[match.under],
              area: match.as,
            })}
      </p>
    );

  return (
    <div
      ref={note}
      className={styles.thenNote}
      aria-live="polite"
      hidden={!content}
    >
      {content}
    </div>
  );
};

export default LogBook;
