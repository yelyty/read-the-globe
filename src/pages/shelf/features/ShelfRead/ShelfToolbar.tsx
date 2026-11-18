import { useState, type RefObject } from 'react';
import {
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';

import type { Goal } from '../../../../types';
import {
  CONTINENT_NAMES,
  continentName,
  type Continent,
} from '../../../../utils/continents';
import { m } from '../../../../paraglide/messages.js';
import Select from '../../../../components/Select/Select';
import Button from '../../../../components/Button/Button';
import { goalName } from '../../../goals/utils/catalogue';
import * as styles from '../../ShelfPage.css';
import type { Mark, Sort } from '../../utils/shelfQuery';
import type { ShelfFilterState } from './useShelfFilters';

const CONTINENTS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
  (continent) => continent !== 'AN'
);

type ShelfToolbarProps = {
  filters: ShelfFilterState;
  searchRef: RefObject<HTMLInputElement | null>;
  /** the years with books, newest first */
  years: string[];
  goals: Goal[];
  /** the country page's code, if the shelf is showing one */
  country?: string;
};

/**
 * Shows the search, the filters (behind one button on a phone), the sort, and Clear.
 */
const ShelfToolbar = ({
  filters,
  searchRef,
  years,
  goals,
  country,
}: ShelfToolbarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleFiltersToggle = () => setFiltersOpen((wasOpen) => !wasOpen);

  /* ---------- lists: each filter's menu starts with "all" ---------- */
  const continentOptions = [
    { value: '' as const, label: m.shelf_all_continents() },
    ...CONTINENTS.map((continentCode) => ({
      value: continentCode,
      label: continentName(continentCode),
    })),
  ];

  const markOptions: { value: Mark; label: string }[] = [
    { value: '', label: m.shelf_mark_any() },
    { value: 'set', label: m.shelf_mark_set() },
    { value: 'author', label: m.shelf_mark_author() },
  ];

  const yearOptions = [
    { value: '', label: m.shelf_all_years() },
    ...years.map((optionYear) => ({ value: optionYear, label: optionYear })),
  ];

  const goalOptions = [
    { value: '', label: m.shelf_all_goals() },
    ...goals.map((option) => ({
      value: String(option.id),
      label: goalName(option.name),
    })),
  ];

  const sortOptions: { value: Sort; label: string }[] = [
    { value: 'new', label: m.shelf_sort_new() },
    { value: 'title', label: m.shelf_sort_title() },
    { value: 'country', label: m.shelf_sort_country() },
  ];

  return (
    <div className={styles.toolbar} role="search">
      <div className={styles.search}>
        <MagnifyingGlassIcon aria-hidden="true" />
        <input
          ref={searchRef}
          type="search"
          value={filters.query}
          onChange={filters.changeQuery}
          placeholder={m.shelf_search_placeholder()}
          aria-label={m.shelf_search_label()}
          autoComplete="off"
        />
      </div>
      {/* phones: the filters fold behind one button */}
      <button
        type="button"
        className={styles.filterBtn}
        aria-expanded={filtersOpen}
        aria-controls="shelf-filters"
        onClick={handleFiltersToggle}
      >
        <FunnelSimpleIcon aria-hidden="true" />
        {m.shelf_filters()}
      </button>
      <div
        className={styles.filters}
        id="shelf-filters"
        role="group"
        aria-label={m.shelf_filter_group()}
        data-open={filtersOpen}
      >
        <Select<Continent | ''>
          variant="pill"
          value={filters.continent}
          label={m.shelf_filter_continent()}
          onChange={filters.changeContinent}
          options={continentOptions}
        />
        {/* set in / author from only means something once a place is chosen */}
        {(country || filters.continent) && (
          <Select<Mark>
            variant="pill"
            value={filters.mark}
            label={m.shelf_mark_label()}
            onChange={filters.changeMark}
            options={markOptions}
          />
        )}
        {years.length > 1 && (
          <Select
            variant="pill"
            value={filters.year}
            label={m.shelf_filter_year()}
            onChange={filters.changeYear}
            options={yearOptions}
          />
        )}
        {goals.length > 0 && (
          <Select
            variant="pill"
            value={filters.goalId}
            label={m.shelf_filter_goal()}
            onChange={filters.changeGoal}
            options={goalOptions}
          />
        )}
      </div>
      <Select<Sort>
        variant="pill"
        value={filters.sort}
        label={m.shelf_sort_label()}
        onChange={filters.changeSort}
        options={sortOptions}
      />
      {filters.canClear && (
        <Button type="button" variant="link" underline onClick={filters.clear}>
          <XIcon aria-hidden="true" />
          {m.shelf_clear()}
        </Button>
      )}
    </div>
  );
};

export default ShelfToolbar;
