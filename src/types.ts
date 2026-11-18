import type { Continent } from './utils/continents';

export interface Country {
  name: string;
  code: string;
}

export interface Author {
  name: string;
  country: Country | null;
}

export interface BookEntry {
  /** the database's numeric id (bigint) */
  id: number;
  title: string;
  /** when it was logged */
  createdAt?: string;
  /** when it was read, YYYY-MM-DD; null on rows saved before read_on existed */
  readOn?: string | null;
  author: Author | null;
  places: Place[];
  goals: {
    goalId: number;
  }[];
}

export interface CountryGroup {
  code: string;
  name: string;
  books: BookEntry[];
}

export interface CountryData {
  [countryCode: string]: CountryGroup;
}

export interface Place {
  id: number;
  name: string;
  lon: number;
  lat: number;
  countryCode?: string | null;
  bookId: number;
  /** not on any map: name is the imagined world, and there is no country */
  imagined?: boolean;
}

/** a book read from an imported reading list, before it is saved */
export type ImportedBook = {
  title: string;
  author: string;
  authorCountry: string;
  /** YYYY-MM-DD; null is today */
  readOn: string | null;
  places: { name: string; country: string | null; imagined?: boolean }[];
};

export interface World {
  id: string;
  name: string;
}

export type GoalKind = 'region' | 'countries' | 'theme';

export interface Goal {
  id: number;
  kind: GoalKind;
  name: string;
  continent: Continent | null;
  countryCodes: string[] | null;
  target: number | null;
  reachedOn: string | null;
}

export interface Profile {
  displayName: string;
  handle: string | null;
  createdAt: string;
}

export interface NextRead {
  id: number;
  title: string;
  author: string | null;
  countryCode: string | null;
  mark: 'set' | 'author' | null;
  createdAt: string;
}

export type Geo = { id: string; rsmKey: string };
