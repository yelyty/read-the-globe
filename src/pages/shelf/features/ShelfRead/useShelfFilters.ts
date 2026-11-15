import { useState, type ChangeEvent, type RefObject } from 'react';
import { useNavigate } from '@tanstack/react-router';

import type { Continent } from '../../../../utils/continents';
import type { Mark, Sort } from '../../utils/shelfQuery';

// the shelf shows this many books, and this many more at each Show more
export const PAGE = 100;

type ShelfFiltersArgs = {
  /** the country page's code, from the address */
  country?: string;
  /** a search a link brought along (?q=) */
  linkedQuery?: string;
  /** the search box, which Clear focuses */
  searchRef: RefObject<HTMLInputElement | null>;
};

// the Read tab's search, filters, sort and how far down the list is shown.
// A new search, filter or sort starts the list from the top.
export function useShelfFilters({
  country,
  linkedQuery,
  searchRef,
}: ShelfFiltersArgs) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(linkedQuery ?? '');
  const [continent, setContinent] = useState<Continent | ''>('');
  const [mark, setMark] = useState<Mark>('');
  const [year, setYear] = useState('');
  const [goalId, setGoalId] = useState('');
  const [sort, setSort] = useState<Sort>('new');
  const [shown, setShown] = useState(PAGE);

  const term = query.trim().toLowerCase();

  const canClear = Boolean(
    term || continent || mark || year || goalId || sort !== 'new' || country
  );

  const reset = () => setShown(PAGE);

  const clear = () => {
    setQuery('');
    setContinent('');
    setMark('');
    setYear('');
    setGoalId('');
    setSort('new');
    reset();
    if (country || linkedQuery) navigate({ to: '/app/shelf' });
    searchRef.current?.focus();
  };

  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    reset();
  };

  // with no continent and no country, the mark filter has nothing to narrow
  const changeContinent = (next: Continent | '') => {
    setContinent(next);
    if (!next && !country) setMark('');
    reset();
  };

  const changeMark = (next: Mark) => {
    setMark(next);
    reset();
  };

  const changeYear = (next: string) => {
    setYear(next);
    reset();
  };

  const changeGoal = (next: string) => {
    setGoalId(next);
    reset();
  };

  const changeSort = (next: Sort) => {
    setSort(next);
    reset();
  };

  const showMore = () => setShown((count) => count + PAGE);

  return {
    query,
    term,
    continent,
    mark,
    year,
    goalId,
    sort,
    shown,
    canClear,
    clear,
    changeQuery,
    changeContinent,
    changeMark,
    changeYear,
    changeGoal,
    changeSort,
    showMore,
  };
}

export type ShelfFilterState = ReturnType<typeof useShelfFilters>;
