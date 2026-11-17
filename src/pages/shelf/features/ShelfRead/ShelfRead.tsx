import { useMemo, useRef } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import {
  ArrowDownIcon,
  DownloadSimpleIcon,
  PushPinIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import type { Marks } from '../../../../utils/atlasMarks';
import { m } from '../../../../paraglide/messages.js';
import { useStatus } from '../../../../hooks/useStatus';
import { Button } from '../../../../components/Button/Button';
import ButtonLink from '../../../../components/Button/ButtonLink';
import { button } from '../../../../components/Button/Button.css';
import ImportCsv from '../../../account/features/YourData/ImportCsv/ImportCsv';
import { exportExample } from '../../../account/features/YourData/readingList/readingList';
import * as styles from '../../ShelfPage.css';
import { shelfQuery, shelfYears } from '../../utils/shelfQuery';
import { PAGE, useShelfFilters } from './useShelfFilters';
import CountryPanel from './CountryPanel';
import ShelfEmpty from './ShelfEmpty';
import ShelfList from './ShelfList';
import ShelfToolbar from './ShelfToolbar';

const shelfRoute = getRouteApi('/app/shelf');

type ShelfReadProps = {
  books: BookEntry[];
  goals: Goal[];
  names: Record<string, string>;
  marks: Marks;
};

// the Read tab: search and filters, a country's page when ?country= is set, and the books by year
const ShelfRead = ({ books, goals, names, marks }: ShelfReadProps) => {
  const { country, q: linkedQuery } = shelfRoute.useSearch();
  const searchRef = useRef<HTMLInputElement>(null);
  const filters = useShelfFilters({ country, linkedQuery, searchRef });
  const status = useStatus();

  const imported = (text: string) => status.show({ text });
  const name = (code?: string) => (code ? (names[code] ?? '') : '');

  const years = useMemo(() => shelfYears(books), [books]);

  const goal = goals.find(
    (candidate) => String(candidate.id) === filters.goalId
  );

  const { list, unfiltered, invite } = shelfQuery(
    books,
    {
      query: filters.query,
      country,
      continent: filters.continent,
      mark: filters.mark,
      year: filters.year,
      goal,
      sort: filters.sort,
    },
    { names, marks }
  );

  const here = country ? marks[country] : undefined;

  if (!books.length) return <ShelfEmpty onImported={imported} />;

  return (
    <>
      <ShelfToolbar
        filters={filters}
        searchRef={searchRef}
        years={years}
        goals={goals}
        country={country}
      />

      {country && here && (
        <CountryPanel code={country} name={name(country)} mark={here} />
      )}

      <p className={styles.importLine}>
        <ImportCsv
          className={button({ variant: 'link', underline: true })}
          onDone={imported}
        >
          <UploadSimpleIcon aria-hidden="true" />
          {m.shelf_import()}
        </ImportCsv>
        <Button type="button" variant="link" underline onClick={exportExample}>
          <DownloadSimpleIcon aria-hidden="true" />
          {m.shelf_download_example()}
        </Button>
      </p>

      {list.length ? (
        <ShelfList
          books={books}
          list={list}
          years={years}
          sort={filters.sort}
          unfiltered={unfiltered}
          shown={filters.shown}
          names={names}
        />
      ) : invite ? (
        <div className={styles.emptyNote}>
          <p>{m.shelf_invite_none({ country: name(invite) })}</p>
          <ButtonLink
            variant="link"
            underline
            to="."
            search={(prev) => ({ ...prev, log: true, country: invite })}
          >
            <PushPinIcon aria-hidden="true" />
            {m.shelf_invite_log({ country: name(invite) })}
          </ButtonLink>
        </div>
      ) : (
        <p className={styles.emptyNote}>
          {filters.term
            ? m.shelf_no_match({ query: filters.query.trim() })
            : m.shelf_nothing_matches()}
        </p>
      )}
      {list.length > filters.shown && (
        <button
          type="button"
          className={styles.moreBtn}
          onClick={filters.showMore}
        >
          <ArrowDownIcon aria-hidden="true" />
          {m.shelf_show_more({
            count: Math.min(PAGE, list.length - filters.shown),
          })}
        </button>
      )}
    </>
  );
};

export default ShelfRead;
