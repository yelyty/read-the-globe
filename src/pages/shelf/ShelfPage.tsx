import { useMemo, useState } from 'react';
import { getRouteApi } from '@tanstack/react-router';

import { useCountryNames } from '../../hooks/useCountryNames';
import { atlasMarks } from '../../utils/atlasMarks';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import NextToRead from './features/NextToRead/NextToRead';
import ShelfRead from './features/ShelfRead/ShelfRead';
import ShelfTabs from './features/ShelfTabs';

const app = getRouteApi('/app');
const shelfRoute = getRouteApi('/app/shelf');

// the Shelf: what's been read, and what's to read next, in two folder tabs
const ShelfPage = () => {
  const { books, goals } = app.useLoaderData();
  const { tab } = shelfRoute.useSearch();
  const next = shelfRoute.useLoaderData();
  const [nextItems, setNextItems] = useState(next.items);
  const names = useCountryNames();

  const marks = useMemo(() => atlasMarks(books), [books]);

  return (
    <>
      <PageTitle>{m.nav_shelf()}</PageTitle>

      <ShelfTabs
        tab={tab === 'next' ? 'next' : 'read'}
        readCount={books.length}
        nextCount={nextItems.length}
      />

      {tab === 'next' ? (
        <div role="tabpanel" id="shelf-next" aria-labelledby="tab-next">
          <NextToRead
            items={nextItems}
            setItems={setNextItems}
            failed={next.failed}
            names={names}
            marks={marks}
            goals={goals}
          />
        </div>
      ) : (
        <div role="tabpanel" id="shelf-read" aria-labelledby="tab-read">
          <ShelfRead books={books} goals={goals} names={names} marks={marks} />
        </div>
      )}
    </>
  );
};

export default ShelfPage;
