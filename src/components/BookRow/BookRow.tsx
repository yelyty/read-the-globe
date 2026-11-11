import { Fragment } from 'react';
import type { BookEntry } from '../../types';
import { coverColor } from '../../utils/coverColors';
import * as styles from './BookRow.css';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import { readDate } from '../../utils/readDate';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';

const formatMonth = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
    month: 'short',
    year: 'numeric',
  });

type BookRowProps = { book: BookEntry; names: Record<string, string> };

const BookRow = ({ book, names }: BookRowProps) => {
  const places = (book.places ?? []).filter(
    (place) => !place.imagined && (place.name || place.countryCode)
  );

  const worlds = (book.places ?? []).filter(
    (place) => place.imagined && place.name
  );

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
            <time dateTime={readDate(book).slice(0, 7)}>
              {formatMonth(readDate(book))}
            </time>
          )}
        </span>
      </div>
      <div className={styles.rowMarks}>
        {places.length ? (
          <span className={styles.mark}>
            <i className={styles.dotSet} aria-hidden="true" />
            <span>
              <span className={styles.srOnly}>{m.book_set_in()} </span>
              {places.map((place, i) => (
                <Fragment key={place.id}>
                  {i > 0 && ', '}
                  {place.name ||
                    (place.countryCode && names[place.countryCode])}
                  {place.name &&
                    place.countryCode &&
                    names[place.countryCode] && (
                      <em className={styles.markCountry}>
                        {' '}
                        · {names[place.countryCode]}
                      </em>
                    )}
                </Fragment>
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
            <i className={styles.dotImagined} aria-hidden="true" />
            <span>
              <span className={styles.srOnly}>{m.book_set_in_world()} </span>
              {worlds.map((world) => world.name).join(', ')}
              <em className={styles.markCountry}> · {m.book_imagined()}</em>
            </span>
          </span>
        )}
        {book.author?.country && (
          <span className={styles.mark}>
            <i className={styles.dotAuthor} aria-hidden="true" />
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
