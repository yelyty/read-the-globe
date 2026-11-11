import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from 'react';
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowDownIcon,
  BooksIcon,
  CaretDownIcon,
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
import { byReadDate, readDate } from '../../utils/readDate';
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  continentName,
  type Continent,
} from '../../utils/continents';
import { atlasMarks } from '../../utils/atlasMarks';
import { countryFrom, PARENT } from '../../utils/countryFrom';
import { countryStamp, loadCountries } from '../PostcardPage/drawPostcard';
import { goalHas, goalName } from '../GoalsPage/goals';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import * as s from './ShelfPage.css';
import BookRow from '../../components/BookRow/BookRow';
import NextToRead from './features/NextToRead';
import ImportCsv from '../account/features/YourData/ImportCsv';
import { exportExample } from '../account/features/YourData/readingList';
import { useStatus } from '../../hooks/useStatus';
import PageTitle from '../../components/PageTitle/PageTitle';

const app = getRouteApi('/app');
const shelfRoute = getRouteApi('/app/shelf');

type Sort = 'new' | 'title' | 'country';
type Mark = '' | 'set' | 'author';

const CONTINENTS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
  (c) => c !== 'AN'
);

const PAGE = 100;

const authorCode = (b: BookEntry) => b.author?.country?.code;
const yearOf = (b: BookEntry) => readDate(b).slice(0, 4);

const placeCodes = (b: BookEntry) =>
  (b.places ?? []).map((p) => p.countryCode).filter((c): c is string => !!c);

const Pick = ({ children, ...props }: ComponentPropsWithoutRef<'select'>) => (
  <span className={s.pick}>
    <select className={s.select} {...props}>
      {children}
    </select>
    <CaretDownIcon aria-hidden="true" />
  </span>
);

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
          (y) => y !== String(new Date().getFullYear()) && y !== years[0]
        )
      )
  );

  // a place filter can count where the story is set, where the author is from, or either
  const hits = (b: BookEntry, test: (code: string) => boolean) => {
    const a = authorCode(b);

    return (
      (mark !== 'author' && placeCodes(b).some(test)) ||
      (mark !== 'set' && !!a && test(a))
    );
  };

  const goal = goals.find((g) => String(g.id) === goalId);
  const q = query.trim().toLowerCase();

  const list = books.filter((b) => {
    if (country && !hits(b, (c) => c === country)) return false;
    if (continent && !hits(b, (c) => CONTINENT_OF[c] === continent))
      return false;
    if (year && yearOf(b) !== year) return false;
    if (
      goal &&
      !(goal.kind === 'theme'
        ? b.goals?.some((g) => g.goalId === goal.id)
        : hits(b, (c) => goalHas(goal, c)))
    )
      return false;
    if (!q) return true;

    const hay = [
      b.title,
      b.author?.name,
      name(authorCode(b)),
      ...(b.places ?? []).flatMap((p) => [
        p.name,
        name(p.countryCode ?? undefined),
      ]),
    ];

    return hay.join(' ').toLowerCase().includes(q);
  });

  if (sort === 'new') list.sort(byReadDate);
  const locale = getLocale();

  if (sort === 'title')
    list.sort((a, b) => a.title.localeCompare(b.title, locale));
  if (sort === 'country')
    list.sort(
      (a, b) =>
        name(authorCode(a)).localeCompare(name(authorCode(b)), locale) ||
        a.title.localeCompare(b.title, locale)
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

    for (const b of books) {
      const n = (by[yearOf(b)] ??= { books: 0, codes: new Set() });

      n.books++;
      for (const c of [authorCode(b), ...placeCodes(b)]) if (c) n.codes.add(c);
    }

    return Object.fromEntries(
      Object.entries(by).map(([y, n]) => [
        y,
        `${m.count_book({ count: n.books })} · ${m.count_country({ count: n.codes.size })}`,
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
      const c = all.get(country);

      if (live && c) setStamp({ ...countryStamp(c), code: country });
    });

    return () => {
      live = false;
    };
  }, [country]);

  const here = country ? marks[country] : undefined;

  const canClear = Boolean(
    q || continent || mark || year || goalId || sort !== 'new' || country
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

  const toggleYear = (y: string) =>
    setFolded((f) => {
      const next = new Set(f);

      if (next.has(y)) next.delete(y);
      else next.add(y);

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
  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft')
      openTab(tab === 'next' ? 'read' : 'next');
  };

  return (
    <>
      <PageTitle>{m.nav_shelf()}</PageTitle>

      {/* folder tabs: the open one is the page colour, so it joins the shelf below */}
      <div className={s.tabs} role="tablist" aria-label={m.nav_shelf()}>
        <button
          type="button"
          role="tab"
          id="tab-read"
          className={s.tab}
          aria-selected={tab !== 'next'}
          aria-controls="shelf-read"
          tabIndex={tab !== 'next' ? 0 : -1}
          onClick={() => openTab('read')}
          onKeyDown={onTabKey}
        >
          {m.shelf_tab_read()} <span className={s.tabN}>{books.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-next"
          className={s.tab}
          aria-selected={tab === 'next'}
          aria-controls="shelf-next"
          tabIndex={tab === 'next' ? 0 : -1}
          onClick={() => openTab('next')}
          onKeyDown={onTabKey}
        >
          {m.shelf_tab_next()}{' '}
          <span className={s.tabN}>{nextItems.length}</span>
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
            <div className={s.emptyPanel}>
              {/* a little shelf waiting for its first books, in the same sticker style as the Goals hilltop */}
              <svg
                className={s.sticker}
                viewBox="0 0 120 100"
                aria-hidden="true"
                focusable="false"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className={s.ssPlank} d="M10 82 H 110" />
                <rect
                  className={s.ssBookA}
                  x="26"
                  y="34"
                  width="15"
                  height="48"
                  rx="2"
                />
                <rect
                  className={s.ssBookB}
                  x="43"
                  y="24"
                  width="15"
                  height="58"
                  rx="2"
                />
                <rect
                  className={s.ssBookC}
                  x="72"
                  y="38"
                  width="15"
                  height="48"
                  rx="2"
                  transform="rotate(-14 72 86)"
                />
                <path className={s.ssBandA} d="M26 44 H 41" />
                <path className={s.ssBandB} d="M43 34 H 58 M43 72 H 58" />
                <rect
                  className={s.ssGap}
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
                <div className={s.emptyActions}>
                  <Link
                    className={s.primary}
                    to="."
                    search={(prev) => ({ ...prev, log: true })}
                  >
                    <PushPinIcon weight="fill" aria-hidden="true" />
                    {m.log_a_book()}
                  </Link>
                  <span className={s.orRule} aria-hidden="true">
                    {m.shelf_or()}
                  </span>
                  <ImportCsv className={s.linkBtn} onDone={imported}>
                    <UploadSimpleIcon aria-hidden="true" />
                    {m.shelf_backlog()}
                  </ImportCsv>
                </div>
                <p className={s.hint}>
                  {m.shelf_csv_hint()}
                  <button
                    type="button"
                    className={s.linkBtn}
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
              <div className={s.toolbar} role="search">
                <div className={s.search}>
                  <MagnifyingGlassIcon aria-hidden="true" />
                  <input
                    ref={search}
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      reset();
                    }}
                    placeholder={m.shelf_search_placeholder()}
                    aria-label={m.shelf_search_label()}
                    autoComplete="off"
                  />
                </div>
                {/* phones: the filters fold behind one button */}
                <button
                  type="button"
                  className={s.filterBtn}
                  aria-expanded={filtersOpen}
                  aria-controls="shelf-filters"
                  onClick={() => setFiltersOpen((o) => !o)}
                >
                  <FunnelSimpleIcon aria-hidden="true" />
                  {m.shelf_filters()}
                </button>
                <div
                  className={s.filters}
                  id="shelf-filters"
                  role="group"
                  aria-label={m.shelf_filter_group()}
                  data-open={filtersOpen}
                >
                  <Pick
                    value={continent}
                    aria-label={m.shelf_filter_continent()}
                    onChange={(e) => {
                      const next = e.target.value as Continent | '';

                      setContinent(next);
                      if (!next && !country) setMark('');
                      reset();
                    }}
                  >
                    <option value="">{m.shelf_all_continents()}</option>
                    {CONTINENTS.map((c) => (
                      <option key={c} value={c}>
                        {continentName(c)}
                      </option>
                    ))}
                  </Pick>
                  {/* set in / author from only means something once a place is chosen */}
                  {(country || continent) && (
                    <Pick
                      value={mark}
                      aria-label={m.shelf_mark_label()}
                      onChange={(e) => {
                        setMark(e.target.value as Mark);
                        reset();
                      }}
                    >
                      <option value="">{m.shelf_mark_any()}</option>
                      <option value="set">{m.shelf_mark_set()}</option>
                      <option value="author">{m.shelf_mark_author()}</option>
                    </Pick>
                  )}
                  {years.length > 1 && (
                    <Pick
                      value={year}
                      aria-label={m.shelf_filter_year()}
                      onChange={(e) => {
                        setYear(e.target.value);
                        reset();
                      }}
                    >
                      <option value="">{m.shelf_all_years()}</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </Pick>
                  )}
                  {goals.length > 0 && (
                    <Pick
                      value={goalId}
                      aria-label={m.shelf_filter_goal()}
                      onChange={(e) => {
                        setGoalId(e.target.value);
                        reset();
                      }}
                    >
                      <option value="">{m.shelf_all_goals()}</option>
                      {goals.map((g) => (
                        <option key={g.id} value={g.id}>
                          {goalName(g.name)}
                        </option>
                      ))}
                    </Pick>
                  )}
                </div>
                <Pick
                  value={sort}
                  aria-label={m.shelf_sort_label()}
                  onChange={(e) => {
                    setSort(e.target.value as Sort);
                    reset();
                  }}
                >
                  <option value="new">{m.shelf_sort_new()}</option>
                  <option value="title">{m.shelf_sort_title()}</option>
                  <option value="country">{m.shelf_sort_country()}</option>
                </Pick>
                {canClear && (
                  <button type="button" className={s.linkBtn} onClick={clear}>
                    <XIcon aria-hidden="true" />
                    {m.shelf_clear()}
                  </button>
                )}
              </div>

              {country && here && (
                <section
                  className={s.country}
                  aria-labelledby="shelf-country-name"
                >
                  <div className={s.countryMap}>
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
                            width={(stamp.width / 128) * 6}
                            height={(stamp.width / 128) * 6}
                            patternTransform="rotate(45)"
                          >
                            <rect
                              className={s.hatchSet}
                              width={(stamp.width / 128) * 6}
                              height={(stamp.width / 128) * 6}
                            />
                            <rect
                              className={s.hatchAuthor}
                              width={(stamp.width / 128) * 3}
                              height={(stamp.width / 128) * 6}
                            />
                          </pattern>
                        </defs>
                        <path
                          d={stamp.d}
                          className={s.shape}
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
                    <h2 className={s.countryName} id="shelf-country-name">
                      {name(country)}
                    </h2>
                    {CONTINENT_OF[country] && (
                      <p className={s.countryMeta}>
                        {continentName(CONTINENT_OF[country])}
                      </p>
                    )}
                    <p className={s.countryWhy}>
                      {here.set.length > 0 && (
                        <span>
                          <i className={s.dotSet} aria-hidden="true" />
                          {m.shelf_set_here({
                            stories: m.count_story({ count: here.set.length }),
                          })}
                        </span>
                      )}
                      {here.author.length > 0 && (
                        <span>
                          <i className={s.dotAuthor} aria-hidden="true" />
                          {m.shelf_from_here({
                            authors: m.count_author({
                              count: here.author.length,
                            }),
                          })}
                        </span>
                      )}
                    </p>
                    <div className={s.countryActions}>
                      <Link
                        className={s.linkBtn}
                        to="."
                        search={(prev) => ({ ...prev, log: true, country })}
                      >
                        <PushPinIcon aria-hidden="true" />
                        {m.shelf_log_another()}
                      </Link>
                      <Link className={s.linkBtn} to="/app/shelf">
                        <BooksIcon aria-hidden="true" />
                        {m.shelf_whole()}
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              <p className={s.importLine}>
                <ImportCsv className={s.linkBtn} onDone={imported}>
                  <UploadSimpleIcon aria-hidden="true" />
                  {m.shelf_import()}
                </ImportCsv>
                <button
                  type="button"
                  className={s.linkBtn}
                  onClick={exportExample}
                >
                  <DownloadSimpleIcon aria-hidden="true" />
                  {m.shelf_download_example()}
                </button>
              </p>

              {list.length ? (
                <ul className={`${bookList} ${s.shelfList}`}>
                  {list.slice(0, shown).map((book, i) => {
                    const y = sort === 'new' ? yearOf(book) : '';
                    const isFolded = !!y && unfiltered && folded.has(y);

                    const heading =
                      y && (i === 0 || yearOf(list[i - 1]) !== y) ? (
                        <li className={s.yearHead}>
                          <h2 className={s.yearTitle}>
                            {/* years only fold on the whole shelf; a search or filter shows every match */}
                            {unfiltered ? (
                              <button
                                type="button"
                                className={s.yearToggle}
                                aria-expanded={!isFolded}
                                onClick={() => toggleYear(y)}
                              >
                                <CaretDownIcon aria-hidden="true" />
                                {y}
                              </button>
                            ) : (
                              y
                            )}
                          </h2>
                          {unfiltered && yearNotes[y] && <p>{yearNotes[y]}</p>}
                        </li>
                      ) : null;

                    return (
                      <Fragment key={book.id}>
                        {heading}
                        {!isFolded && <BookRow book={book} names={names} />}
                      </Fragment>
                    );
                  })}
                </ul>
              ) : invite ? (
                <div className={s.emptyNote}>
                  <p>{m.shelf_invite_none({ country: name(invite) })}</p>
                  <Link
                    className={s.linkBtn}
                    to="."
                    search={(prev) => ({ ...prev, log: true, country: invite })}
                  >
                    <PushPinIcon aria-hidden="true" />
                    {m.shelf_invite_log({ country: name(invite) })}
                  </Link>
                </div>
              ) : (
                <p className={s.emptyNote}>
                  {q
                    ? m.shelf_no_match({ query: query.trim() })
                    : m.shelf_nothing_matches()}
                </p>
              )}
              {list.length > shown && (
                <button
                  type="button"
                  className={s.moreBtn}
                  onClick={() => setShown(shown + PAGE)}
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
