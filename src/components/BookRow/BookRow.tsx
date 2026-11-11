import { Fragment } from 'react';
import type { BookEntry } from '../../types';
import { coverColor } from '../../utils/coverColors';
import * as s from './BookRow.css';
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
    (p) => !p.imagined && (p.name || p.countryCode)
  );
  const worlds = (book.places ?? []).filter((p) => p.imagined && p.name);
  return (
    <li className={s.row}>
      <div className={s.rowMain}>
        <i
          className={s.cover}
          style={{
            background: coverColor(book.title + (book.author?.name ?? '')),
          }}
          aria-hidden="true"
        />
        <span className={s.rowTitle}>{book.title}</span>
        <span className={s.rowAuthor}>
          {book.author?.name}
          {readDate(book) && (
            <time dateTime={readDate(book).slice(0, 7)}>
              {formatMonth(readDate(book))}
            </time>
          )}
        </span>
      </div>
      <div className={s.rowMarks}>
        {places.length ? (
          <span className={s.mark}>
            <i className={s.dotSet} aria-hidden="true" />
            <span>
              <span className={s.srOnly}>{m.book_set_in()} </span>
              {places.map((p, i) => (
                <Fragment key={p.id}>
                  {i > 0 && ', '}
                  {p.name || (p.countryCode && names[p.countryCode])}
                  {p.name && p.countryCode && names[p.countryCode] && (
                    <em className={s.markCountry}> · {names[p.countryCode]}</em>
                  )}
                </Fragment>
              ))}
            </span>
          </span>
        ) : (
          !worlds.length && (
            <span className={s.markNone}>{m.book_no_places()}</span>
          )
        )}
        {worlds.length > 0 && (
          <span className={s.mark}>
            <i className={s.dotImagined} aria-hidden="true" />
            <span>
              <span className={s.srOnly}>{m.book_set_in_world()} </span>
              {worlds.map((p) => p.name).join(', ')}
              <em className={s.markCountry}> · {m.book_imagined()}</em>
            </span>
          </span>
        )}
        {book.author?.country && (
          <span className={s.mark}>
            <i className={s.dotAuthor} aria-hidden="true" />
            <span>
              <span className={s.srOnly}>{m.book_author_from()} </span>
              {names[book.author.country.code] ?? book.author.country.name}
            </span>
          </span>
        )}
      </div>
      <div className={s.rowSide}>
        <Link
          className={s.edit}
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
