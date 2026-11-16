import { describe, expect, it } from 'vitest';

import type { BookEntry, Goal } from '../../../types';
import { idFor } from '../../../testing/idFor';
import { atlasMarks } from '../../../utils/atlasMarks';
import {
  shelfQuery,
  shelfYears,
  yearNotes,
  type ShelfFilters,
} from './shelfQuery';

const FRANCE = '250';
const JAPAN = '392';
const DENMARK = '208';
const GREENLAND = '304';
const MALTA = '470';

const names = {
  [FRANCE]: 'France',
  [JAPAN]: 'Japan',
  [DENMARK]: 'Denmark',
  [GREENLAND]: 'Greenland',
  [MALTA]: 'Malta',
};

const book = (
  id: string,
  {
    author,
    from,
    setIn = [],
    place = '',
    read = '2025-06-01',
    goals = [],
  }: {
    author?: string;
    from?: string;
    setIn?: string[];
    place?: string;
    read?: string;
    goals?: number[];
  } = {}
): BookEntry => ({
  id: idFor(id),
  title: id,
  readOn: read,
  author: author
    ? { name: author, country: from ? { code: from, name: '' } : null }
    : null,
  places: setIn.map((countryCode, i) => ({
    id: i,
    name: i ? '' : place,
    lon: 0,
    lat: 0,
    countryCode,
    bookId: idFor(id),
  })),
  goals: goals.map((goalId) => ({ goalId })),
});

// a Japanese author's novel set in France, a French author's set in Japan, a Danish one set in Greenland
const shelf = [
  book('Kokoro', {
    author: 'Sōseki',
    from: JAPAN,
    setIn: [JAPAN],
    read: '2024-02-01',
  }),
  book('Zazie', {
    author: 'Queneau',
    from: FRANCE,
    setIn: [FRANCE],
    place: 'Paris',
    goals: [1],
  }),
  book('Silence', {
    author: 'Endō',
    from: JAPAN,
    setIn: [FRANCE],
    read: '2024-09-01',
  }),
  book('Smilla', {
    author: 'Høeg',
    from: DENMARK,
    setIn: [GREENLAND],
    goals: [1],
  }),
];

const filters = (extra: Partial<ShelfFilters> = {}): ShelfFilters => ({
  query: '',
  continent: '',
  mark: '',
  year: '',
  sort: 'title',
  ...extra,
});

const ids = (extra: Partial<ShelfFilters> = {}, books = shelf) =>
  shelfQuery(books, filters(extra), {
    names,
    marks: atlasMarks(books),
  }).list.map((entry) => entry.title);

describe('the Shelf query', () => {
  it('shows every book when nothing is chosen', () => {
    const view = shelfQuery(shelf, filters(), {
      names,
      marks: atlasMarks(shelf),
    });

    expect(view.list).toHaveLength(shelf.length);
    expect(view.unfiltered).toBe(true);
    expect(view.invite).toBeNull();
  });

  it('searches titles, authors, places and country names, whatever the case', () => {
    expect(ids({ query: 'kokoro' })).toEqual(['Kokoro']);
    expect(ids({ query: 'HØEG' })).toEqual(['Smilla']);
    expect(ids({ query: 'paris' })).toEqual(['Zazie']);
    expect(ids({ query: ' Greenland ' })).toEqual(['Smilla']);
  });

  it('counts a country by either mark, or just the one chosen', () => {
    expect(ids({ country: FRANCE })).toEqual(['Silence', 'Zazie']);
    expect(ids({ country: FRANCE, mark: 'set' })).toEqual(['Silence', 'Zazie']);
    expect(ids({ country: FRANCE, mark: 'author' })).toEqual(['Zazie']);

    expect(ids({ country: JAPAN, mark: 'author' })).toEqual([
      'Kokoro',
      'Silence',
    ]);
  });

  it('filters by continent through the same marks', () => {
    expect(ids({ continent: 'AS' })).toEqual(['Kokoro', 'Silence']);
    expect(ids({ continent: 'AS', mark: 'set' })).toEqual(['Kokoro']);
  });

  it('filters by the year a book was read', () => {
    expect(ids({ year: '2024' })).toEqual(['Kokoro', 'Silence']);
  });

  it('shows a theme goal’s ticked books, and a place goal’s books by their countries', () => {
    const theme: Goal = {
      id: 1,
      kind: 'theme',
      name: 'T',
      continent: null,
      countryCodes: null,
      target: 3,
      reachedOn: null,
    };

    const nordic: Goal = {
      id: 2,
      kind: 'countries',
      name: 'N',
      continent: null,
      countryCodes: [DENMARK],
      target: null,
      reachedOn: null,
    };

    expect(ids({ goal: theme })).toEqual(['Smilla', 'Zazie']);
    // Greenland's story counts under Denmark
    expect(ids({ goal: nordic })).toEqual(['Smilla']);
  });

  it('sorts newest read first, by title, or by the author’s country', () => {
    expect(ids({ sort: 'new' })).toEqual([
      'Zazie',
      'Smilla',
      'Silence',
      'Kokoro',
    ]);

    expect(ids({ sort: 'country' })).toEqual([
      'Smilla',
      'Zazie',
      'Kokoro',
      'Silence',
    ]);
  });

  it('says when something is filtered out, so years stop folding', () => {
    expect(
      shelfQuery(shelf, filters({ year: '2024' }), {
        names,
        marks: atlasMarks(shelf),
      }).unfiltered
    ).toBe(false);
  });

  it('invites a first book for a searched country with none yet', () => {
    const view = shelfQuery(shelf, filters({ query: 'Malta' }), {
      names,
      marks: atlasMarks(shelf),
    });

    expect(view.list).toEqual([]);
    expect(view.invite).toBe(MALTA);
  });

  it('doesn’t invite for a country already on the atlas, or for words that aren’t a country', () => {
    const marks = atlasMarks(shelf);

    expect(
      shelfQuery(shelf, filters({ query: 'zzz' }), { names, marks }).invite
    ).toBeNull();

    // Japan has books, but none matches "Japan" plus this year
    expect(
      shelfQuery(shelf, filters({ query: 'Japan', year: '1999' }), {
        names,
        marks,
      }).invite
    ).toBeNull();
  });
});

describe('the Shelf’s years', () => {
  it('lists the years with books, newest first', () => {
    expect(shelfYears(shelf)).toEqual(['2025', '2024']);
  });

  it('says how many books and countries each year reached', () => {
    const notes = yearNotes(shelf);

    expect(Object.keys(notes).sort()).toEqual(['2024', '2025']);
    expect(notes['2024']).toContain('2');
  });
});
