import { useEffect, useState } from 'react';
import {
  getRouteApi,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react';

import { useStatus } from '../../hooks/useStatus';
import { useLanding, type Landing } from '../../hooks/useLanding';
import type { BookEntry, NextRead } from '../../types';
import { saveBook } from '../../api/books/books';
import { worldsOf } from '../../utils/worlds';
import { readDate } from '../../utils/readDate';
import { getCountryNames } from '../../utils/countryNames';
import { m } from '../../paraglide/messages.js';
import * as styles from './LogBook.css';
import LogForm from './LogForm';

const app = getRouteApi('/app');

// ?country=<code> or ?world=<name> starts it with a place there (a click on the map, a world's Log a book set here).
const LogBook = () => {
  const status = useStatus();
  const { log, edit, next, country, world } = app.useSearch();
  const { books, goals, worlds } = app.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();
  const [names, setNames] = useState<Record<string, string>>();
  const [said, setSaid] = useState('');
  const [, setLanding] = useLanding();

  // on the Shelf, ?country is also the country page, so it stays when the form closes
  const onShelf = useRouterState({
    select: (st) => st.matches.some((mt) => mt.routeId === '/app/shelf'),
  });

  const book = edit ? books.find((entry) => entry.id === edit) : undefined;
  const open = Boolean(log || book);

  // the item "Log it" came from, from the Shelf's loader (the only place it can be pressed)
  const nextItem = useRouterState({
    select: (st) =>
      (
        st.matches.find((mt) => mt.routeId === '/app/shelf')?.loaderData as
          { items: NextRead[] } | undefined
      )?.items.find((it) => it.id === next),
  });

  // the countries in the reader's language, with the English ones kept so a country typed in English still matches
  useEffect(() => {
    if (!open || names) return;
    getCountryNames().then(setNames);
  }, [open, names]);

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
    await router.invalidate();
    // Home says where the new book went when its pins land
    if (!landing) setSaid(message);
  };

  // Undo puts the book back through the same save as the form: a new row with the same title, author, places,
  // read date and goal ticks. ponytail: it counts as logged again, so it returns to the top of Recent reads
  const removed = async (gone: BookEntry) => {
    await close();
    await router.invalidate();

    status.show({
      text: m.log_removed({ title: gone.title }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const { error } = await saveBook({
            title: gone.title,
            author: gone.author?.name ?? '',
            authorCountry: gone.author?.country?.code ?? '',
            readOn: readDate(gone),
            places: gone.places.map((place) => ({
              name: place.name,
              country: place.imagined ? null : (place.countryCode ?? ''),
              imagined: place.imagined,
            })),
            goalIds: gone.goals.map((goal) => goal.goalId),
          });

          if (error) return status.show({ text: error });
          await router.invalidate();
          status.show({ text: m.log_back({ title: gone.title }) });
        },
      },
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
