import { useMemo, useState } from 'react';

import type { BookEntry } from '../../../../types';
import { list as bookList } from '../../../../components/BookRow/BookRow.css';
import * as styles from '../../ShelfPage.css';
import { yearNotes, type Sort } from '../../utils/shelfQuery';
import ShelfEntry from './ShelfEntry';

type ShelfListProps = {
  /** every book on the shelf, for each year's note */
  books: BookEntry[];
  /** the books the search and filters let through, in order */
  list: BookEntry[];
  /** the years with books, newest first */
  years: string[];
  sort: Sort;
  /** nothing narrows the list, so years can fold */
  unfiltered: boolean;
  /** how many of the list are shown */
  shown: number;
  names: Record<string, string>;
};

// the books, newest first under their year's heading; a folded year hides its books
const ShelfList = ({
  books,
  list,
  years,
  sort,
  unfiltered,
  shown,
  names,
}: ShelfListProps) => {
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

  // each year's line says where that year's reading went: books and countries
  const notes = useMemo(() => yearNotes(books), [books]);

  const handleYearToggle = (shelfYear: string) =>
    setFolded((prev) => {
      const next = new Set(prev);

      if (next.has(shelfYear)) next.delete(shelfYear);
      else next.add(shelfYear);

      return next;
    });

  return (
    <ul className={`${bookList} ${styles.shelfList}`}>
      {list.slice(0, shown).map((book, i) => (
        <ShelfEntry
          key={book.id}
          book={book}
          previous={list[i - 1]}
          byYear={sort === 'new'}
          foldable={unfiltered}
          folded={folded}
          notes={notes}
          names={names}
          onYearToggle={handleYearToggle}
        />
      ))}
    </ul>
  );
};

export default ShelfList;
