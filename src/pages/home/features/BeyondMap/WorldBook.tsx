import { Link } from '@tanstack/react-router';
import { PencilSimpleIcon } from '@phosphor-icons/react';

import type { BookEntry } from '../../../../types';
import { coverColor } from '../../../../utils/coverColors';
import { formatDay } from '../../../../utils/formatDate';
import { readDate } from '../../../../utils/readDate';
import { m } from '../../../../paraglide/messages.js';
import * as styles from '../../HomePage.css';

type WorldBookProps = {
  book: BookEntry;
  /** Edit leaves the world's dialog for the book's own form */
  onEdit: () => void;
};

// a book set in an imagined world: its cover colour, title, author, when it was read, and Edit
const WorldBook = ({ book, onEdit }: WorldBookProps) => {
  const day = readDate(book);

  return (
    <li>
      <i
        className={styles.tipCover}
        style={{
          background: coverColor(book.title + (book.author?.name ?? '')),
        }}
        aria-hidden="true"
      />
      <div>
        <span className={styles.tipTitle}>{book.title}</span>
        <span>{book.author?.name}</span>
        {day && <time dateTime={day}>{formatDay(day)}</time>}
      </div>
      <Link
        className={styles.more}
        to="."
        search={(prev) => ({ ...prev, edit: book.id })}
        aria-label={m.book_edit({ title: book.title })}
        onClick={onEdit}
      >
        <PencilSimpleIcon aria-hidden="true" />
        {m.common_edit()}
      </Link>
    </li>
  );
};

export default WorldBook;
