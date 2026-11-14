import type { BookEntry } from '../../types';
import { coverColor } from '../../utils/coverColors';
import { m } from '../../paraglide/messages.js';
import * as styles from './HomePage.css';

type TipBookProps = {
  book: BookEntry;
  /** the story is set in the country */
  set: boolean;
  /** the author is from it */
  author: boolean;
};

// a book in a country's tip: its cover colour, title and author, and why it's there
const TipBook = ({ book, set, author }: TipBookProps) => {
  const swatch =
    set && author
      ? styles.swatchBoth
      : set
        ? styles.swatchSet
        : styles.swatchAuthor;

  const why = set && author ? m.tip_both() : set ? m.tip_set() : m.tip_author();

  return (
    <li>
      <i
        className={styles.tipCover}
        style={{
          background: coverColor(book.title + (book.author?.name ?? '')),
        }}
        aria-hidden="true"
      />
      <span className={styles.tipBook}>
        <span className={styles.tipTitle}>{book.title}</span>
        <span>{book.author?.name}</span>
        <span className={styles.tipWhy}>
          <i className={swatch} aria-hidden="true" />
          {why}
        </span>
      </span>
    </li>
  );
};

export default TipBook;
