import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowDownIcon,
  BooksIcon,
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  PushPinIcon,
  UploadSimpleIcon,
  XIcon,
} from '@phosphor-icons/react';

import { useCountryNames } from '../../hooks/useCountryNames';
import type { BookEntry } from '../../types';
import { list as bookList } from '../../components/BookRow/BookRow.css';
import { byReadDate } from '../../utils/readDate';
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  continentName,
  type Continent,
} from '../../utils/continents';
import { atlasMarks } from '../../utils/atlasMarks';
import { countryFrom, PARENT } from '../../utils/countryFrom';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import BookRow from '../../components/BookRow/BookRow';
import { useStatus } from '../../hooks/useStatus';
import PageTitle from '../../components/PageTitle/PageTitle';
import Select from '../../components/Select/Select';
import { countryStamp, loadCountries } from '../postcard/drawPostcard';
import { goalHas, goalName } from '../goals/goals';
import ImportCsv from '../account/features/YourData/ImportCsv';
import { exportExample } from '../account/features/YourData/readingList';
import * as styles from './ShelfPage.css';
import NextToRead from './features/NextToRead';
import YearHead from './YearHead';
import { hatchSize } from './hatch';
import { authorCode, yearOf, placeCodes } from './bookFields';

const app = getRouteApi('/app');
const shelfRoute = getRouteApi('/app/shelf');

type Sort = 'new' | 'title' | 'country';
type Mark = '' | 'set' | 'author';

const CONTINENTS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
  (continent) => continent !== 'AN'
);

const PAGE = 100;

const ShelfPage = () => {
  const { books, goals } = app.useLoaderData();
  const { country, tab, q: linkedQuery } = shelfRoute.useSearch();
  const next = shelfRoute.useLoaderData();
  const [nextItems, setNextItems] = useState(next.items);
  const navigate = useNavigate();
  const names = useCountryNames();
  const [query, setQuery] = useState(linkedQuery ?? '');
  const [continent, setContinent] = useState<Continent | ''>('');
  const [mark, setMark] = useState<Mark>('');
  const [year, setYear] = useState('');
  const [goalId, setGoalId] = useState('');
  const [sort, setSort] = useState<Sort>('new');
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const status = useStatus();
  const imported = (text: string) => status.show({ text });
  const name = (code?: string) => (code ? (names[code] ?? '') : '');

  const marks = useMemo(() => atlasMarks(books), [books]);

  const years = useMemo(
    () => [...new Set(books.map(yearOf).filter(Boolean))].sort().reverse(),
    [books]
  );

  // earlier years start folded; this year and the newest logged year stay open
  const [folded, setFolded] = useState(
    () =>
      new Set(
        years.filter(
          (shelfYear) =>
            shelfYear !== String(new Date().getFullYear()) &&
            shelfYear !== years[0]
        )
      )
  );

  // a place filter can count where the story is set, where the author is from, or either
  const hits = (book: BookEntry, test: (code: string) => boolean) => {
    const authorCountry = authorCode(book);

    return (
      (mark !== 'author' && placeCodes(book).some(test)) ||
      (mark !== 'set' && !!authorCountry && test(authorCountry))
    );
  };

  const goal = goals.find((candidate) => String(candidate.id) === goalId);
  const term = query.trim().toLowerCase();

  const list = books.filter((book) => {
    if (country && !hits(book, (code) => code === country)) return false;
    if (continent && !hits(book, (code) => CONTINENT_OF[code] === continent))
      return false;
    if (year && yearOf(book) !== year) return false;
    if (
      goal &&
      !(goal.kind === 'theme'
        ? book.goals?.some((link) => link.goalId === goal.id)
        : hits(book, (code) => goalHas(goal, code)))
    )
      return false;
    if (!term) return true;

    const hay = [
      book.title,
      book.author?.name,
      name(authorCode(book)),
      ...(book.places ?? []).flatMap((place) => [
        place.name,
        name(place.countryCode ?? undefined),
      ]),
    ];

    return hay.join(' ').toLowerCase().includes(term);
  });

  if (sort === 'new') list.sort(byReadDate);
  const locale = getLocale();

  if (sort === 'title')
    list.sort((first, second) =>
      first.title.localeCompare(second.title, locale)
    );
  if (sort === 'country')
    list.sort(
      (first, second) =>
        name(authorCode(first)).localeCompare(
          name(authorCode(second)),
          locale
        ) || first.title.localeCompare(second.title, locale)
    );
  const unfiltered = list.length === books.length;
  // a search that names a country with nothing on the shelf is an invitation, not a dead end
  const named = !list.length ? countryFrom(query, names) : null;

  const invite =
    named && !marks[PARENT[named.code] ?? named.code]
      ? (PARENT[named.code] ?? named.code)
      : null;

  // each year's line says where that year's reading went: books and countries
  const yearNotes = useMemo(() => {
    const by: Record<string, { books: number; codes: Set<string> }> = {};

    for (const book of books) {
      const note = (by[yearOf(book)] ??= { books: 0, codes: new Set() });

      note.books++;
      for (const code of [authorCode(book), ...placeCodes(book)])
        if (code) note.codes.add(code);
    }

    return Object.fromEntries(
      Object.entries(by).map(([noteYear, note]) => [
        noteYear,
        `${m.count_book({ count: note.books })} · ${m.count_country({ count: note.codes.size })}`,
      ])
    );
  }, [books]);

  // the country page's outline, from the same map file as Home and the postcard
  const [stamp, setStamp] = useState<
    (ReturnType<typeof countryStamp> & { code: string }) | null
  >(null);

  useEffect(() => {
    if (!country) return;
    let live = true;

    loadCountries().then((all) => {
      const shape = all.get(country);

      if (live && shape) setStamp({ ...countryStamp(shape), code: country });
    });

    return () => {
      live = false;
    };
  }, [country]);

  const here = country ? marks[country] : undefined;

  const canClear = Boolean(
    term || continent || mark || year || goalId || sort !== 'new' || country
  );

  const clear = () => {
    setQuery('');
    setContinent('');
    setMark('');
    setYear('');
    setGoalId('');
    setSort('new');
    setShown(PAGE);
    if (country || linkedQuery) navigate({ to: '/app/shelf' });
    search.current?.focus();
  };

  const toggleYear = (shelfYear: string) =>
    setFolded((prev) => {
      const next = new Set(prev);

      if (next.has(shelfYear)) next.delete(shelfYear);
      else next.add(shelfYear);

      return next;
    });

  const reset = () => setShown(PAGE);

  const openTab = (to: 'read' | 'next') => {
    navigate({
      to: '/app/shelf',
      search: (prev) => ({ ...prev, tab: to === 'next' ? 'next' : undefined }),
      replace: true,
    });

    document.getElementById(`tab-${to}`)?.focus();
  };

  // the arrow keys move between the two tabs
  const onTabKey = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === 'ArrowRight' || keyEvent.key === 'ArrowLeft')
      openTab(tab === 'next' ? 'read' : 'next');
  };

  /* ---------- handlers: a new search, filter or sort starts the list from the top ---------- */
  const handleTab = (to: 'read' | 'next') => () => openTab(to);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    reset();
  };

  const handleFiltersToggle = () => setFiltersOpen((wasOpen) => !wasOpen);

  // with no continent and no country, the mark filter has nothing to narrow
  const handleContinentChange = (next: Continent | '') => {
    setContinent(next);
    if (!next && !country) setMark('');
    reset();
  };

  const handleMarkChange = (next: Mark) => {
    setMark(next);
    reset();
  };

  const handleYearChange = (next: string) => {
    setYear(next);
    reset();
  };

  const handleGoalChange = (next: string) => {
    setGoalId(next);
    reset();
  };

  const handleSortChange = (next: Sort) => {
    setSort(next);
    reset();
  };

  const handleYearToggle = (bookYear: string) => () => toggleYear(bookYear);
  const handleShowMore = () => setShown(shown + PAGE);

  /* ---------- lists ---------- */
  // each filter's menu starts with "all"
  const continentOptions = [
    { value: '' as const, label: m.shelf_all_continents() },
    ...CONTINENTS.map((continentCode) => ({
      value: continentCode,
      label: continentName(continentCode),
    })),
  ];

  const yearOptions = [
    { value: '', label: m.shelf_all_years() },
    ...years.map((optionYear) => ({ value: optionYear, label: optionYear })),
  ];

  const goalOptions = [
    { value: '', label: m.shelf_all_goals() },
    ...goals.map((option) => ({
      value: String(option.id),
      label: goalName(option.name),
    })),
  ];

  // newest first, a year's first book comes under its heading; a folded year hides its books
  const renderBook = (book: BookEntry, i: number) => {
    const bookYear = sort === 'new' ? yearOf(book) : '';
    const isFolded = !!bookYear && unfiltered && folded.has(bookYear);
    const firstOfYear = i === 0 || yearOf(list[i - 1]) !== bookYear;

    return (
      <Fragment key={book.id}>
        {bookYear && firstOfYear && (
          <YearHead
            year={bookYear}
            foldable={unfiltered}
            folded={isFolded}
            note={yearNotes[bookYear]}
            onToggle={handleYearToggle(bookYear)}
          />
        )}
        {!isFolded && <BookRow book={book} names={names} />}
      </Fragment>
    );
  };

  return (
    <>
      <PageTitle>{m.nav_shelf()}</PageTitle>

      {/* folder tabs: the open one is the page colour, so it joins the shelf below */}
      <div className={styles.tabs} role="tablist" aria-label={m.nav_shelf()}>
        <button
          type="button"
          role="tab"
          id="tab-read"
          className={styles.tab}
          aria-selected={tab !== 'next'}
          aria-controls="shelf-read"
          tabIndex={tab !== 'next' ? 0 : -1}
          onClick={handleTab('read')}
          onKeyDown={onTabKey}
        >
          {m.shelf_tab_read()}{' '}
          <span className={styles.tabN}>{books.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-next"
          className={styles.tab}
          aria-selected={tab === 'next'}
          aria-controls="shelf-next"
          tabIndex={tab === 'next' ? 0 : -1}
          onClick={handleTab('next')}
          onKeyDown={onTabKey}
        >
          {m.shelf_tab_next()}{' '}
          <span className={styles.tabN}>{nextItems.length}</span>
        </button>
      </div>

      {tab === 'next' ? (
        <div role="tabpanel" id="shelf-next" aria-labelledby="tab-next">
          <NextToRead
            items={nextItems}
            setItems={setNextItems}
            failed={next.failed}
            names={names}
            marks={marks}
            goals={goals}
          />
        </div>
      ) : (
        <div role="tabpanel" id="shelf-read" aria-labelledby="tab-read">
          {!books.length ? (
            <div className={styles.emptyPanel}>
              {/* a little shelf waiting for its first books, in the same sticker style as the Goals hilltop */}
              <svg
                className={styles.sticker}
                viewBox="0 0 120 100"
                aria-hidden="true"
                focusable="false"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className={styles.ssPlank} d="M10 82 H 110" />
                <rect
                  className={styles.ssBookA}
                  x="26"
                  y="34"
                  width="15"
                  height="48"
                  rx="2"
                />
                <rect
                  className={styles.ssBookB}
                  x="43"
                  y="24"
                  width="15"
                  height="58"
                  rx="2"
                />
                <rect
                  className={styles.ssBookC}
                  x="72"
                  y="38"
                  width="15"
                  height="48"
                  rx="2"
                  transform="rotate(-14 72 86)"
                />
                <path className={styles.ssBandA} d="M26 44 H 41" />
                <path className={styles.ssBandB} d="M43 34 H 58 M43 72 H 58" />
                <rect
                  className={styles.ssGap}
                  x="90"
                  y="40"
                  width="14"
                  height="42"
                  rx="2"
                />
              </svg>
              <div>
                <h2>{m.shelf_empty_title()}</h2>
                <p>{m.shelf_empty_text()}</p>
                <div className={styles.emptyActions}>
                  <Link
                    className={styles.primary}
                    to="."
                    search={(prev) => ({ ...prev, log: true })}
                  >
                    <PushPinIcon weight="fill" aria-hidden="true" />
                    {m.log_a_book()}
                  </Link>
                  <span className={styles.orRule} aria-hidden="true">
                    {m.shelf_or()}
                  </span>
                  <ImportCsv className={styles.linkBtn} onDone={imported}>
                    <UploadSimpleIcon aria-hidden="true" />
                    {m.shelf_backlog()}
                  </ImportCsv>
                </div>
                <p className={styles.hint}>
                  {m.shelf_csv_hint()}
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={exportExample}
                  >
                    <DownloadSimpleIcon aria-hidden="true" />
                    {m.shelf_download_example()}
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.toolbar} role="search">
                <div className={styles.search}>
                  <MagnifyingGlassIcon aria-hidden="true" />
                  <input
                    ref={search}
                    type="search"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder={m.shelf_search_placeholder()}
                    aria-label={m.shelf_search_label()}
                    autoComplete="off"
                  />
                </div>
                {/* phones: the filters fold behind one button */}
                <button
                  type="button"
                  className={styles.filterBtn}
                  aria-expanded={filtersOpen}
                  aria-controls="shelf-filters"
                  onClick={handleFiltersToggle}
                >
                  <FunnelSimpleIcon aria-hidden="true" />
                  {m.shelf_filters()}
                </button>
                <div
                  className={styles.filters}
                  id="shelf-filters"
                  role="group"
                  aria-label={m.shelf_filter_group()}
                  data-open={filtersOpen}
                >
                  <Select<Continent | ''>
                    variant="pill"
                    value={continent}
                    label={m.shelf_filter_continent()}
                    onChange={handleContinentChange}
                    options={continentOptions}
                  />
                  {/* set in / author from only means something once a place is chosen */}
                  {(country || continent) && (
                    <Select<Mark>
                      variant="pill"
                      value={mark}
                      label={m.shelf_mark_label()}
                      onChange={handleMarkChange}
                      options={[
                        { value: '', label: m.shelf_mark_any() },
                        { value: 'set', label: m.shelf_mark_set() },
                        { value: 'author', label: m.shelf_mark_author() },
                      ]}
                    />
                  )}
                  {years.length > 1 && (
                    <Select
                      variant="pill"
                      value={year}
                      label={m.shelf_filter_year()}
                      onChange={handleYearChange}
                      options={yearOptions}
                    />
                  )}
                  {goals.length > 0 && (
                    <Select
                      variant="pill"
                      value={goalId}
                      label={m.shelf_filter_goal()}
                      onChange={handleGoalChange}
                      options={goalOptions}
                    />
                  )}
                </div>
                <Select<Sort>
                  variant="pill"
                  value={sort}
                  label={m.shelf_sort_label()}
                  onChange={handleSortChange}
                  options={[
                    { value: 'new', label: m.shelf_sort_new() },
                    { value: 'title', label: m.shelf_sort_title() },
                    { value: 'country', label: m.shelf_sort_country() },
                  ]}
                />
                {canClear && (
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={clear}
                  >
                    <XIcon aria-hidden="true" />
                    {m.shelf_clear()}
                  </button>
                )}
              </div>

              {country && here && (
                <section
                  className={styles.country}
                  aria-labelledby="shelf-country-name"
                >
                  <div className={styles.countryMap}>
                    {stamp?.code === country && (
                      <svg
                        viewBox={stamp.viewBox}
                        aria-hidden="true"
                        focusable="false"
                      >
                        <defs>
                          {/* both marks: the olive and rust hatch, a 3px stripe at the drawn size */}
                          <pattern
                            id="shelf-hatch"
                            patternUnits="userSpaceOnUse"
                            width={hatchSize(stamp.width)}
                            height={hatchSize(stamp.width)}
                            patternTransform="rotate(45)"
                          >
                            <rect
                              className={styles.hatchSet}
                              width={hatchSize(stamp.width)}
                              height={hatchSize(stamp.width)}
                            />
                            <rect
                              className={styles.hatchAuthor}
                              width={hatchSize(stamp.width) / 2}
                              height={hatchSize(stamp.width)}
                            />
                          </pattern>
                        </defs>
                        <path
                          d={stamp.d}
                          className={styles.shape}
                          data-mark={
                            here.set.length && here.author.length
                              ? 'both'
                              : here.set.length
                                ? 'set'
                                : 'author'
                          }
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h2 className={styles.countryName} id="shelf-country-name">
                      {name(country)}
                    </h2>
                    {CONTINENT_OF[country] && (
                      <p className={styles.countryMeta}>
                        {continentName(CONTINENT_OF[country])}
                      </p>
                    )}
                    <p className={styles.countryWhy}>
                      {here.set.length > 0 && (
                        <span>
                          <i className={styles.dotSet} aria-hidden="true" />
                          {m.shelf_set_here({
                            stories: m.count_story({ count: here.set.length }),
                          })}
                        </span>
                      )}
                      {here.author.length > 0 && (
                        <span>
                          <i className={styles.dotAuthor} aria-hidden="true" />
                          {m.shelf_from_here({
                            authors: m.count_author({
                              count: here.author.length,
                            }),
                          })}
                        </span>
                      )}
                    </p>
                    <div className={styles.countryActions}>
                      <Link
                        className={styles.linkBtn}
                        to="."
                        search={(prev) => ({ ...prev, log: true, country })}
                      >
                        <PushPinIcon aria-hidden="true" />
                        {m.shelf_log_another()}
                      </Link>
                      <Link className={styles.linkBtn} to="/app/shelf">
                        <BooksIcon aria-hidden="true" />
                        {m.shelf_whole()}
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              <p className={styles.importLine}>
                <ImportCsv className={styles.linkBtn} onDone={imported}>
                  <UploadSimpleIcon aria-hidden="true" />
                  {m.shelf_import()}
                </ImportCsv>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={exportExample}
                >
                  <DownloadSimpleIcon aria-hidden="true" />
                  {m.shelf_download_example()}
                </button>
              </p>

              {list.length ? (
                <ul className={`${bookList} ${styles.shelfList}`}>
                  {list.slice(0, shown).map(renderBook)}
                </ul>
              ) : invite ? (
                <div className={styles.emptyNote}>
                  <p>{m.shelf_invite_none({ country: name(invite) })}</p>
                  <Link
                    className={styles.linkBtn}
                    to="."
                    search={(prev) => ({ ...prev, log: true, country: invite })}
                  >
                    <PushPinIcon aria-hidden="true" />
                    {m.shelf_invite_log({ country: name(invite) })}
                  </Link>
                </div>
              ) : (
                <p className={styles.emptyNote}>
                  {term
                    ? m.shelf_no_match({ query: query.trim() })
                    : m.shelf_nothing_matches()}
                </p>
              )}
              {list.length > shown && (
                <button
                  type="button"
                  className={styles.moreBtn}
                  onClick={handleShowMore}
                >
                  <ArrowDownIcon aria-hidden="true" />
                  {m.shelf_show_more({
                    count: Math.min(PAGE, list.length - shown),
                  })}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ShelfPage;
