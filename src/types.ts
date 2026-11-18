import type { Continent } from './utils/continents';

export type Country = {
  name: string;
  code: string;
};

export type Author = {
  name: string;
  country: Country | null;
};

export type BookEntry = {
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
};

export type CountryGroup = {
  code: string;
  name: string;
  books: BookEntry[];
};

export type CountryData = {
  [countryCode: string]: CountryGroup;
};

export type Place = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  countryCode?: string | null;
  bookId: number;
  /** not on any map: name is the imagined world, and there is no country */
  imagined?: boolean;
};

export type World = {
  id: string;
  name: string;
};

export type GoalKind = 'region' | 'countries' | 'theme';

export type Goal = {
  id: number;
  kind: GoalKind;
  name: string;
  continent: Continent | null;
  countryCodes: string[] | null;
  target: number | null;
  reachedOn: string | null;
};

export type Profile = {
  displayName: string;
  handle: string | null;
  createdAt: string;
};

export type NextRead = {
  id: number;
  title: string;
  author: string | null;
  countryCode: string | null;
  mark: 'set' | 'author' | null;
  createdAt: string;
};

export type Geo = { id: string; rsmKey: string };
