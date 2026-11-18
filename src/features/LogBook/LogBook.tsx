import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getRouteApi,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';

import { useUndo } from '../../hooks/useUndo';
import { useLanding, type Landing } from '../../hooks/useLanding';
import {
  useBooks,
  useGoals,
  useReaderId,
  useRefresh,
  useWorlds,
} from '../../hooks/useReader';
import type { BookEntry } from '../../types';
import { saveBook } from '../../api/books/books';
import { countryNamesQuery, nextReadsQuery } from '../../api/queries';
import { worldsOf } from '../../utils/worlds';
import { m } from '../../paraglide/messages.js';
import { draftOf } from './bookLog';
import * as styles from './LogBook.css';
import LogForm from './LogForm';

const app = getRouteApi('/app');

/**
 * Shows the Log a book dialog, to add a book or to edit one.
 * ?country=<code> or ?world=<name> starts the form with a place there, for example after a click on the map.
 */
const LogBook = () => {
  const offerUndo = useUndo();
  const { log, edit, next, country, world } = app.useSearch();
  const books = useBooks();
  const goals = useGoals();
  const worlds = useWorlds();
  const readerId = useReaderId();
  const navigate = useNavigate();
  const refresh = useRefresh();
  const [said, setSaid] = useState('');
  const [, setLanding] = useLanding();

  // on the Shelf, ?country is also the country page, so it stays when the form closes
  const onShelf = useRouterState({
    select: (st) => st.matches.some((mt) => mt.routeId === '/app/shelf'),
  });

  const book = books.find((entry) => entry.id === edit);
  const open = Boolean(log || book);

  // the item "Log it" came from, from the Shelf's list (the only place it can be pressed)
  const { data: nextItem } = useQuery({
    ...nextReadsQuery(readerId),
    enabled: Boolean(next),
    select: (list) => list.items.find((it) => it.id === next),
  });

  // the countries in the reader's language, with the English ones kept so a country typed in English still matches
  const { data: names } = useQuery({ ...countryNamesQuery, enabled: open });

  const close = () =>
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        log: undefined,
        edit: undefined,
        next: undefined,
        world: undefined,
        country: onShelf ? prev.country : undefined,
      }),
    });

  // a new book goes to Home to land on the atlas; an edit stays where it was
  const done = async (message: string, landing?: Landing) => {
    if (landing) {
      setLanding(landing);
      await navigate({ to: '/app', search: {} });
    } else await close();
    // a book logged from the Shelf's next reads leaves that list
    await refresh('books', 'nextReads');
    // Home says where the new book went when its pins land
    if (!landing) setSaid(message);
  };

  // Undo puts the book back through the same save as the form: a new row with the same title, author, places,
  // read date and goal ticks. ponytail: it counts as logged again, so it returns to the top of Recent reads
  const removed = async (gone: BookEntry) => {
    await close();
    await refresh('books');

    offerUndo({
      said: m.log_removed({ title: gone.title }),
      undo: async () => (await saveBook(draftOf(gone))).problem,
      undone: m.log_back({ title: gone.title }),
    });
  };

  const worldNames = worldsOf(books, worlds).map(
    (worldEntry) => worldEntry.name
  );

  return (
    <>
      {open && names && (
        <LogForm
          key={edit ?? 'new'}
          book={book}
          nextItem={nextItem}
          setIn={country}
          world={world}
          names={names}
          books={books}
          goals={goals}
          worlds={worldNames}
          onClose={close}
          onDone={done}
          onRemoved={removed}
        />
      )}
      <p className={styles.srOnly} role="status">
        {said}
      </p>
    </>
  );
};

export default LogBook;
