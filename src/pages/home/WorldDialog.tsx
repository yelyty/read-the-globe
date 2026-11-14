import { useNavigate } from '@tanstack/react-router';
import { PushPinIcon } from '@phosphor-icons/react';

import type { BookEntry } from '../../types';
import { byReadDate } from '../../utils/readDate';
import { type WorldRow } from '../../utils/worlds';
import { Button } from '../../components/Button/Button';
import Dialog from '../../components/Dialog/Dialog';
import DialogActions from '../../components/Dialog/DialogActions';
import DialogText from '../../components/Dialog/DialogText';
import { m } from '../../paraglide/messages.js';
import * as styles from './HomePage.css';
import WorldBook from './WorldBook';

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

  // log a book set in this world, from the log form opened over Home
  const handleLogHere = () => {
    onClose();

    navigate({
      to: '.',
      search: (prev) => ({ ...prev, log: true, world: world.name }),
    });
  };

  const renderBook = (book: BookEntry) => (
    <WorldBook key={book.id} book={book} onEdit={onClose} />
  );

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
        <ul className={styles.worldBooks}>{books.map(renderBook)}</ul>
      ) : (
        <DialogText>{m.world_no_books()}</DialogText>
      )}
      <DialogActions>
        <Button type="button" variant="text" onClick={onClose}>
          {m.common_close()}
        </Button>
        <Button type="button" id="world-log" onClick={handleLogHere}>
          <PushPinIcon aria-hidden="true" />
          {m.world_log_here()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorldDialog;
