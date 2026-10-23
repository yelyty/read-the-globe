import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react";
import BookRow from "../../components/BookRow/BookRow";
import { list } from "../../components/BookRow/BookRow.css";
import type { BookEntry } from "../../types";
import * as s from "./HomePage.css";

type RecentReadsProps = { books: BookEntry[]; names: Record<string, string> };

const RecentReads = ({ books, names }: RecentReadsProps) => (
  <section className={s.section} aria-labelledby="recent-title">
    <div className={s.subHead}>
      <h2 id="recent-title" className={s.h2}>
        <MapPinIcon className={s.h2Icon} aria-hidden="true" />
        Recent reads
      </h2>
      <Link className={s.more} to="/app/shelf">
        Shelf <ArrowRightIcon aria-hidden="true" />
      </Link>
    </div>
    <ul className={list}>
      {books.map((book) => (
        <BookRow key={book.id} book={book} names={names} />
      ))}
    </ul>
  </section>
);

export default RecentReads;
