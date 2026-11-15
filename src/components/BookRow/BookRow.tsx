import { PencilSimpleIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';

import type { BookEntry } from '../../types';
import { coverColor } from '../../utils/coverColors';
import { readDate } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import { isoYearMonth } from '../../utils/isoDate';
import { formatMonth } from '../../utils/formatDate';
import MarkDot from '../MarkDot/MarkDot';
import * as styles from './BookRow.css';
import BookPlace from './BookPlace';

type BookRowProps = { book: BookEntry; names: Record<string, string> };

const BookRow = ({ book, names }: BookRowProps) => {
  const places = (book.places ?? []).filter(
    (place) => !place.imagined && (place.name || place.countryCode)
  );

  const worlds = (book.places ?? []).filter(
    (place) => place.imagined && place.name
  );

  const worldNames = worlds.map((world) => world.name).join(', ');

  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <i
          className={styles.cover}
          style={{
            background: coverColor(book.title + (book.author?.name ?? '')),
          }}
          aria-hidden="true"
        />
        <span className={styles.rowTitle}>{book.title}</span>
        <span className={styles.rowAuthor}>
          {book.author?.name}
          {readDate(book) && (
            <time dateTime={isoYearMonth(readDate(book))}>
              {formatMonth(readDate(book))}
            </time>
          )}
        </span>
      </div>
      <div className={styles.rowMarks}>
        {places.length ? (
          <span className={styles.mark}>
            <MarkDot kind="set" />
            <span>
              <span className={styles.srOnly}>{m.book_set_in()} </span>
              {places.map((place, i) => (
                <BookPlace
                  key={place.id}
                  place={place}
                  names={names}
                  first={i === 0}
                />
              ))}
            </span>
          </span>
        ) : (
          !worlds.length && (
            <span className={styles.markNone}>{m.book_no_places()}</span>
          )
        )}
        {worlds.length > 0 && (
          <span className={styles.mark}>
            <MarkDot kind="imagined" />
            <span>
              <span className={styles.srOnly}>{m.book_set_in_world()} </span>
              {worldNames}
              <em className={styles.markCountry}> · {m.book_imagined()}</em>
            </span>
          </span>
        )}
        {book.author?.country && (
          <span className={styles.mark}>
            <MarkDot kind="author" />
            <span>
              <span className={styles.srOnly}>{m.book_author_from()} </span>
              {names[book.author.country.code] ?? book.author.country.name}
            </span>
          </span>
        )}
      </div>
      <div className={styles.rowSide}>
        <Link
          className={styles.edit}
          to="."
          search={(prev) => ({ ...prev, edit: book.id })}
          aria-label={m.book_edit({ title: book.title })}
        >
          <PencilSimpleIcon aria-hidden="true" />
          {m.common_edit()}
        </Link>
      </div>
    </li>
  );
};

export default BookRow;
