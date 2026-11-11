import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, MapPinIcon } from '@phosphor-icons/react';

import BookRow from '../../../components/BookRow/BookRow';
import { list } from '../../../components/BookRow/BookRow.css';
import type { BookEntry } from '../../../types';
import * as styles from '../HomePage.css';
import { m } from '../../../paraglide/messages.js';

type RecentReadsProps = { books: BookEntry[]; names: Record<string, string> };

const RecentReads = ({ books, names }: RecentReadsProps) => (
  <section className={styles.section} aria-labelledby="recent-title">
    <div className={styles.subHead}>
      <h2 id="recent-title" className={styles.h2}>
        <MapPinIcon className={styles.h2Icon} aria-hidden="true" />
        {m.home_recent()}
      </h2>
      <Link className={styles.more} to="/app/shelf">
        {m.nav_shelf()} <ArrowRightIcon aria-hidden="true" />
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
