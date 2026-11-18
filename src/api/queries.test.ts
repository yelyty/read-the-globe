import { describe, expect, it, vi } from 'vitest';

// the loaders, as stand-ins that name what they were asked for
vi.mock('./getBooks', () => ({ default: (id: string) => `books of ${id}` }));

vi.mock('./goals/goals', () => ({
  getGoals: (id: string) => `goals of ${id}`,
}));

vi.mock('./worlds/worlds', () => ({
  getWorlds: (id: string) => `worlds of ${id}`,
}));

vi.mock('./nextReads/nextReads', () => ({
  getNextReads: (id: string) => `next reads of ${id}`,
}));

vi.mock('./Profile/getProfile', () => ({
  getProfile: (id: string) => `profile of ${id}`,
}));

vi.mock('../utils/countryStamps', () => ({ loadCountries: vi.fn() }));
vi.mock('../utils/countryNames', () => ({ getCountryNames: vi.fn() }));
vi.mock('../utils/world', () => ({ worldShapes: vi.fn() }));

const queries = await import('./queries');

// a query's function, called as TanStack Query would
const run = (options: { queryFn?: unknown }) =>
  (options.queryFn as () => unknown)();

describe('reader queries', () => {
  it('keeps every part of a reader’s data under the reader’s key', () => {
    expect(queries.readerKey('r1')).toEqual(['reader', 'r1']);

    expect(queries.readerDataKey('r1', 'goals')).toEqual([
      'reader',
      'r1',
      'goals',
    ]);
  });

  it('reads each part for the reader asked about', () => {
    const cases = [
      [queries.booksQuery, 'books', 'books of r1'],
      [queries.goalsQuery, 'goals', 'goals of r1'],
      [queries.worldsQuery, 'worlds', 'worlds of r1'],
      [queries.nextReadsQuery, 'nextReads', 'next reads of r1'],
      [queries.profileQuery, 'profile', 'profile of r1'],
    ] as const;

    for (const [query, part, read] of cases) {
      const options = query('r1');

      expect(options.queryKey).toEqual(['reader', 'r1', part]);
      expect(run(options)).toBe(read);
    }
  });
});

describe('shared queries', () => {
  it('reads the map and its names once for the whole visit', () => {
    for (const options of [
      queries.countriesQuery,
      queries.countryNamesQuery,
      queries.worldShapesQuery,
    ])
      expect(options.staleTime).toBe(Infinity);
  });

  it('keeps them out of any reader’s data', () => {
    expect(queries.countriesQuery.queryKey).toEqual(['countries']);
    expect(queries.countryNamesQuery.queryKey).toEqual(['countryNames']);
    expect(queries.worldShapesQuery.queryKey).toEqual(['worldShapes']);
  });
});
