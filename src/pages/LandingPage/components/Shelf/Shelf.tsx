import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  BooksIcon,
  CaretDownIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  PushPinIcon,
  XIcon,
} from "@phosphor-icons/react";

import * as s from "./ShelfPage.css";
import BookRow from "../../../../components/BookRow/BookRow";
import { useCountryNames } from "../../../../hooks/useCountryNames";
import type { BookEntry } from "../../../../types";
import { atlasMarks } from "../../../../utils/atlasMarks";
import {
  CONTINENT_NAMES,
  type Continent,
  type CONTINENT_OF,
} from "../../../../utils/continents";
import { loadCountries } from "../../../PostcardPage/drawPostcard";

const app = getRouteApi("/app");
const shelfRoute = getRouteApi("/app/shelf");

type Sort = "new" | "title" | "country";
type Mark = "" | "set" | "author";
const SORT_LABEL: Record<Sort, string> = {
  new: "newest first",
  title: "by title",
  country: "by author’s country",
};
const CONTINENTS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
  (c) => c !== "AN",
);
const PAGE = 100;

const authorCode = (b: BookEntry) => b.author?.country?.code;
const yearOf = (b: BookEntry) => (b.createdAt ?? "").slice(0, 4);
const placeCodes = (b: BookEntry) =>
  (b.places ?? []).map((p) => p.countryCode).filter((c): c is string => !!c);
const count = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

// Every book you have logged, as in the app mock: search, filters (continent, set there or author from there,
// year), three sorts, and year headings when newest first; earlier years fold away. ?country= (a click on the
// map) opens with that country's page: its outline, and why each book is here.
const ShelfPage = () => {
  const { books } = app.useLoaderData();
  const { country } = shelfRoute.useSearch();
  const navigate = useNavigate();
  const names = useCountryNames();
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState<Continent | "">("");
  const [mark, setMark] = useState<Mark>("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState<Sort>("new");
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const name = (code?: string) => (code ? (names[code] ?? "") : "");

  const marks = useMemo(() => atlasMarks(books), [books]);
  const years = useMemo(
    () => [...new Set(books.map(yearOf).filter(Boolean))].sort().reverse(),
    [books],
  );
  // earlier years start folded; this year and the newest logged year stay open
  const [folded, setFolded] = useState(
    () =>
      new Set(
        years.filter(
          (y) => y !== String(new Date().getFullYear()) && y !== years[0],
        ),
      ),
  );

  // a place filter can count where the story is set, where the author is from, or either
  const hits = (b: BookEntry, test: (code: string) => boolean) => {
    const a = authorCode(b);
    return (
      (mark !== "author" && placeCodes(b).some(test)) ||
      (mark !== "set" && !!a && test(a))
    );
  };

  const q = query.trim().toLowerCase();
  const list = books.filter((b) => {
    if (country && !hits(b, (c) => c === country)) return false;
    if (continent && !hits(b, (c) => CONTINENT_OF[c] === continent))
      return false;
    if (year && yearOf(b) !== year) return false;
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
    return hay.join(" ").toLowerCase().includes(q);
  });
  if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "country")
    list.sort(
      (a, b) =>
        name(authorCode(a)).localeCompare(name(authorCode(b))) ||
        a.title.localeCompare(b.title),
    );
  const unfiltered = list.length === books.length;

  // the summary names every filter in play, so a short list never looks like missing books
  const markWord = (place: string) =>
    mark === "set"
      ? `set in ${place}`
      : mark === "author"
        ? `by authors from ${place}`
        : `with ${place}`;
  const scope = [
    country && markWord(name(country)),
    continent && !country && markWord(CONTINENT_NAMES[continent]),
    year && `from ${year}`,
  ]
    .filter(Boolean)
    .join(", ");
  const summary = !books.length
    ? ""
    : unfiltered
      ? `${count(books.length, "book", "books")}, ${SORT_LABEL[sort]}`
      : `${list.length} of ${count(books.length, "book", "books")}${scope ? ` ${scope}` : ""}`;

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
        `${count(n.books, "book", "books")} · ${count(n.codes.size, "country", "countries")}`,
      ]),
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
    q || continent || mark || year || sort !== "new" || country,
  );
  const clear = () => {
    setQuery("");
    setContinent("");
    setMark("");
    setYear("");
    setSort("new");
    setShown(PAGE);
    if (country) navigate({ to: "/app/shelf" });
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

  return (
    <div className={s.page}>
      <div className={s.viewHead}>
        <h1 className={s.title}>Shelf</h1>
        {summary && <p className={s.summary}>{summary}</p>}
      </div>

      {!books.length ? (
        <div className={s.emptyPanel}>
          <h2>Your shelf is empty</h2>
          <p>
            Every book you log stands here, newest first, with the places it
            took you.
          </p>
          <Link
            className={s.primary}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            Log a book
          </Link>
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
                placeholder="Search titles, authors, places, countries"
                aria-label="Search your shelf"
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
              Filters
            </button>
            <div
              className={s.filters}
              id="shelf-filters"
              role="group"
              aria-label="Filter your shelf"
              data-open={filtersOpen}
            >
              <select
                className={s.select}
                value={continent}
                aria-label="Filter by continent"
                onChange={(e) => {
                  const next = e.target.value as Continent | "";
                  setContinent(next);
                  if (!next && !country) setMark("");
                  reset();
                }}
              >
                <option value="">All continents</option>
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>
                    {CONTINENT_NAMES[c]}
                  </option>
                ))}
              </select>
              {/* set in / author from only means something once a place is chosen */}
              {(country || continent) && (
                <select
                  className={s.select}
                  value={mark}
                  aria-label="Which mark counts"
                  onChange={(e) => {
                    setMark(e.target.value as Mark);
                    reset();
                  }}
                >
                  <option value="">Set there or author from there</option>
                  <option value="set">Set there</option>
                  <option value="author">Author from there</option>
                </select>
              )}
              {years.length > 1 && (
                <select
                  className={s.select}
                  value={year}
                  aria-label="Filter by year"
                  onChange={(e) => {
                    setYear(e.target.value);
                    reset();
                  }}
                >
                  <option value="">All years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <select
              className={s.select}
              value={sort}
              aria-label="Sort your shelf"
              onChange={(e) => {
                setSort(e.target.value as Sort);
                reset();
              }}
            >
              <option value="new">Newest first</option>
              <option value="title">By title</option>
              <option value="country">By author’s country</option>
            </select>
            {canClear && (
              <button type="button" className={s.linkBtn} onClick={clear}>
                <XIcon aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          {country && here && (
            <section className={s.country} aria-labelledby="shelf-country-name">
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
                          ? "both"
                          : here.set.length
                            ? "set"
                            : "author"
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
                    {CONTINENT_NAMES[CONTINENT_OF[country]]}
                  </p>
                )}
                <p className={s.countryWhy}>
                  {here.set.length > 0 && (
                    <span>
                      <i className={s.dotSet} aria-hidden="true" />
                      {count(here.set.length, "story", "stories")} set here
                    </span>
                  )}
                  {here.author.length > 0 && (
                    <span>
                      <i className={s.dotAuthor} aria-hidden="true" />
                      {count(here.author.length, "author", "authors")} from here
                    </span>
                  )}
                </p>
                <div className={s.countryActions}>
                  <Link
                    className={s.linkBtn}
                    to="."
                    search={(prev) => ({ ...prev, log: true })}
                  >
                    <PushPinIcon aria-hidden="true" />
                    Log another book
                  </Link>
                  <Link className={s.linkBtn} to="/app/shelf">
                    <BooksIcon aria-hidden="true" />
                    The whole shelf
                  </Link>
                </div>
              </div>
            </section>
          )}

          {list.length ? (
            <ul className={`${bookList} ${s.shelfList}`}>
              {list.slice(0, shown).map((book, i) => {
                const y = sort === "new" ? yearOf(book) : "";
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
          ) : (
            <p className={s.emptyNote}>
              {q
                ? `No books match “${query.trim()}”. Try a broader word, or clear the filters.`
                : "Nothing on your shelf matches that. Try a broader word, or clear the filters."}
            </p>
          )}
          {list.length > shown && (
            <button
              type="button"
              className={s.moreBtn}
              onClick={() => setShown(shown + PAGE)}
            >
              <ArrowDownIcon aria-hidden="true" />
              Show {Math.min(PAGE, list.length - shown)} more
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ShelfPage;
