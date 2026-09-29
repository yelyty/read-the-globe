import { Fragment, useRef, useState } from "react";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react";
import { useCountryNames } from "../../hooks/useCountryNames";
import type { BookEntry } from "../../types";
import { list as bookList } from "../../components/BookRow/BookRow.css";
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  type Continent,
} from "../../utils/continents";
import * as s from "./ShelfPage.css";
import BookRow from "../../components/BookRow/BookRow";

const app = getRouteApi("/app");
const shelfRoute = getRouteApi("/app/shelf");

type Sort = "new" | "title" | "country";
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

// Every book you have logged, as in the app mock: search, a continent filter, three sorts,
// year headings when newest first. ?country= (a click on the map) narrows it to one country.
const ShelfPage = () => {
  const { books } = app.useLoaderData();
  const { country } = shelfRoute.useSearch();
  const navigate = useNavigate();
  const names = useCountryNames();
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState<Continent | "">("");
  const [sort, setSort] = useState<Sort>("new");
  const [shown, setShown] = useState(PAGE);
  const search = useRef<HTMLInputElement>(null);
  const name = (code?: string) => (code ? (names[code] ?? "") : "");

  const q = query.trim().toLowerCase();
  const list = books.filter((b) => {
    if (
      country &&
      authorCode(b) !== country &&
      !placeCodes(b).includes(country)
    )
      return false;
    if (
      continent &&
      CONTINENT_OF[authorCode(b) ?? ""] !== continent &&
      !placeCodes(b).some((c) => CONTINENT_OF[c] === continent)
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
    return hay.join(" ").toLowerCase().includes(q);
  });
  if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "country")
    list.sort(
      (a, b) =>
        name(authorCode(a)).localeCompare(name(authorCode(b))) ||
        a.title.localeCompare(b.title),
    );

  const summary = !books.length
    ? ""
    : list.length === books.length
      ? `${list.length} ${list.length === 1 ? "book" : "books"}, ${SORT_LABEL[sort]}`
      : `${list.length} of ${books.length} books${country ? ` with ${name(country)}` : ""}`;

  const clear = () => {
    setQuery("");
    setContinent("");
    setSort("new");
    setShown(PAGE);
    if (country) navigate({ to: "/app/shelf" });
    search.current?.focus();
  };

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
            <MapPinIcon weight="fill" aria-hidden="true" />
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
                  setShown(PAGE);
                }}
                placeholder="Search titles, authors, places, countries"
                aria-label="Search your shelf"
                autoComplete="off"
              />
            </div>
            <select
              className={s.select}
              value={continent}
              aria-label="Filter by continent"
              onChange={(e) => {
                setContinent(e.target.value as Continent | "");
                setShown(PAGE);
              }}
            >
              <option value="">All continents</option>
              {CONTINENTS.map((c) => (
                <option key={c} value={c}>
                  {CONTINENT_NAMES[c]}
                </option>
              ))}
            </select>
            <select
              className={s.select}
              value={sort}
              aria-label="Sort your shelf"
              onChange={(e) => {
                setSort(e.target.value as Sort);
                setShown(PAGE);
              }}
            >
              <option value="new">Newest first</option>
              <option value="title">By title</option>
              <option value="country">By author’s country</option>
            </select>
            <button type="button" className={s.linkBtn} onClick={clear}>
              Clear
            </button>
          </div>

          {list.length ? (
            <ul className={`${bookList} ${s.shelfList}`}>
              {list.slice(0, shown).map((book, i) => {
                const y = sort === "new" ? yearOf(book) : "";
                const heading =
                  y && (i === 0 || yearOf(list[i - 1]) !== y) ? (
                    <li className={s.yearHead}>
                      <h2>{y}</h2>
                    </li>
                  ) : null;
                return (
                  <Fragment key={book.id}>
                    {heading}
                    <BookRow book={book} names={names} />
                  </Fragment>
                );
              })}
            </ul>
          ) : (
            <p className={s.emptyNote}>
              Nothing on your shelf matches that. Try a broader word, or clear
              the filters.
            </p>
          )}
          {list.length > shown && (
            <button
              type="button"
              className={s.moreBtn}
              onClick={() => setShown(shown + PAGE)}
            >
              Show {Math.min(PAGE, list.length - shown)} more
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ShelfPage;
