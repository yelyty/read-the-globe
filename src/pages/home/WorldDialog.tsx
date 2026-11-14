import { Link, useNavigate } from '@tanstack/react-router';
import { PencilSimpleIcon, PushPinIcon } from '@phosphor-icons/react';

import { coverColor } from '../../utils/coverColors';
import { byReadDate, readDate } from '../../utils/readDate';
import { type WorldRow } from '../../utils/worlds';
import { Button } from '../../components/Button/Button';
import Dialog from '../../components/Dialog/Dialog';
import DialogActions from '../../components/Dialog/DialogActions';
import DialogText from '../../components/Dialog/DialogText';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import * as styles from './HomePage.css';

const formatDay = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// a world's box opens its books in a dialog, with the way to log another one set there
const WorldDialog = ({
  world,
  onClose,
}: {
  world: WorldRow;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const books = [...world.books].sort(byReadDate);

  return (
    <Dialog
      open
      onClose={onClose}
      title={world.name}
      sub={
        <p className={styles.worldSub}>
          {m.world_beyond()} ·{' '}
          {books.length
            ? m.count_book({ count: books.length })
            : m.world_no_books_short()}
        </p>
      }
      initialFocus="world-log"
    >
      {books.length ? (
        <ul className={styles.worldBooks}>
          {books.map((book) => (
            <li key={book.id}>
              <i
                className={styles.tipCover}
                style={{
                  background: coverColor(
                    book.title + (book.author?.name ?? '')
                  ),
                }}
                aria-hidden="true"
              />
              <div>
                <span className={styles.tipTitle}>{book.title}</span>
                <span>{book.author?.name}</span>
                {readDate(book) && (
                  <time dateTime={readDate(book)}>
                    {formatDay(readDate(book))}
                  </time>
                )}
              </div>
              <Link
                className={styles.more}
                to="."
                search={(prev) => ({ ...prev, edit: book.id })}
                aria-label={m.book_edit({ title: book.title })}
                onClick={onClose}
              >
                <PencilSimpleIcon aria-hidden="true" />
                {m.common_edit()}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <DialogText>{m.world_no_books()}</DialogText>
      )}
      <DialogActions>
        <Button type="button" variant="text" onClick={onClose}>
          {m.common_close()}
        </Button>
        <Button
          type="button"
          id="world-log"
          onClick={() => {
            onClose();

            navigate({
              to: '.',
              search: (prev) => ({ ...prev, log: true, world: world.name }),
            });
          }}
        >
          <PushPinIcon aria-hidden="true" />
          {m.world_log_here()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorldDialog;
