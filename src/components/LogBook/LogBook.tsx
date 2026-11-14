import { useEffect, useMemo, useState } from 'react';
import {
  getRouteApi,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Feature } from 'geojson';

import { useStatus } from '../../hooks/useStatus';
import { useLanding, type Landing } from '../../hooks/useLanding';
import type { BookEntry, NextRead } from '../../types';
import { saveBook } from '../../api/books/books';
import { worldShapes } from '../../utils/worldShapes';
import { worldsOf } from '../../utils/worlds';
import { readDate } from '../../utils/readDate';
import { getCountryNames } from '../../utils/countryNames';
import { toAlpha2 } from '../../utils/toIsoNumeric';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
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
  const [shapes, setShapes] = useState<Record<string, Feature>>();
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

  // country names from the 50m map, the same list as the countries table (the 110m one misses small countries);
  // the shapes themselves size up a region goal, to tell whether this book reached it
  useEffect(() => {
    if (!open || shapes) return;
    worldShapes().then(setShapes);
    // the English names, so a country typed in English still matches in Czech or Ukrainian
    void getCountryNames();
  }, [open, shapes]);

  const names = useMemo(() => {
    if (!shapes) return undefined;
    let dn: Intl.DisplayNames | null = null;

    try {
      if (getLocale() !== 'en')
        dn = new Intl.DisplayNames([getLocale()], { type: 'region' });
    } catch {
      // an old browser: the map's English names
    }

    // in the reader's language where the browser knows the country, else the map's English name
    return Object.fromEntries(
      Object.entries(shapes).map(([code, shape]) => {
        const a2 = toAlpha2(code);
        const local = a2 && dn?.of(a2);

        return [
          code,
          local && local !== a2 ? local : String(shape.properties?.name ?? ''),
        ];
      })
    );
  }, [shapes]);

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

  return (
    <>
      {open && shapes && names && (
        <LogForm
          key={edit ?? 'new'}
          book={book}
          nextItem={nextItem}
          setIn={country}
          world={world}
          shapes={shapes}
          names={names}
          books={books}
          goals={goals}
          worlds={worldsOf(books, worlds).map((worldEntry) => worldEntry.name)}
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
