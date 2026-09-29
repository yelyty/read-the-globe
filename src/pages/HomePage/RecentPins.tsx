import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import type { BookEntry } from "../../types";
import { coverColor } from "../../utils/coverColors";
import * as s from "./HomePage.css";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type RecentPinsProps = { books: BookEntry[]; names: Record<string, string> };

// The latest books, each with its two marks: where it is set, and where its author is from.
const RecentPins = ({ books, names }: RecentPinsProps) => (
  <section className={s.section} aria-labelledby="recent-title">
    <div className={s.subHead}>
      <h2 id="recent-title" className={s.h2}>
        Recent pins
      </h2>
      <Link className={s.more} to="/app/shelf">
        The whole shelf <ArrowRightIcon aria-hidden="true" />
      </Link>
    </div>
    <ul className={s.rows}>
      {books.map((book) => {
        const places = (book.places ?? []).filter(
          (p) => p.name || p.countryCode,
        );
        return (
          <li key={book.id} className={s.row}>
            <div className={s.rowMain}>
              <i
                className={s.cover}
                style={{
                  background: coverColor(
                    book.title + (book.author?.name ?? ""),
                  ),
                }}
                aria-hidden="true"
              />
              <span className={s.rowTitle}>{book.title}</span>
              <span className={s.rowAuthor}>{book.author?.name}</span>
            </div>
            <div className={s.rowMarks}>
              {places.length ? (
                <span className={s.mark}>
                  <i className={s.dotSet} aria-hidden="true" />
                  <span>
                    <span className={s.srOnly}>Set in </span>
                    {places.map((p, i) => (
                      <Fragment key={p.id}>
                        {i > 0 && ", "}
                        {p.name}
                        {p.countryCode && names[p.countryCode] && (
                          <em className={s.markCountry}>
                            {" "}
                            · {names[p.countryCode]}
                          </em>
                        )}
                      </Fragment>
                    ))}
                  </span>
                </span>
              ) : (
                <span className={s.markNone}>No places listed</span>
              )}
              {book.author?.country && (
                <span className={s.mark}>
                  <i className={s.dotAuthor} aria-hidden="true" />
                  <span>
                    <span className={s.srOnly}>Author from </span>
                    {names[book.author.country.code] ??
                      book.author.country.name}
                  </span>
                </span>
              )}
            </div>
            <div className={s.rowSide}>
              {book.createdAt && (
                <time dateTime={book.createdAt}>
                  {formatDate(book.createdAt)}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);

export default RecentPins;
