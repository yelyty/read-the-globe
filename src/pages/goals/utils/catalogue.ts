import type { GoalKind } from '../../../types';
import { CONTINENT_NAMES, type Continent } from '../../../utils/continents';
import { toNumeric } from '../../../utils/toIsoNumeric';
import { m } from '../../../paraglide/messages.js';
import type { GoalDraft, Progress } from './goalProgress';

/* The goals the app offers, how a goal's name reads in the reader's language, and the limits of the goal form. */

export const MAX_GOALS = 10;

/** a new theme goal starts at this many books, and can count up to the most */
export const DEFAULT_THEME_TARGET = 5;
export const MAX_THEME_TARGET = 200;

export const REGIONS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
  (continent) => continent !== 'AN'
);

/** a catalogue goal; slug: its ?add= deep link from the Journal; journal: it has Reading ideas there */
export type CatalogueGoal = GoalDraft & { slug?: string; journal?: true };

const draft = (
  kind: GoalKind,
  name: string,
  extra: Partial<CatalogueGoal>
): CatalogueGoal => ({
  kind,
  name,
  continent: null,
  countryCodes: null,
  target: null,
  ...extra,
});

const codes = (alpha2: string) =>
  alpha2.split(' ').map((code) => toNumeric(code)!);

export const CATALOGUE: CatalogueGoal[] = [
  draft('region', 'Around South America', { continent: 'SA' }),
  draft('region', 'Across Africa', { continent: 'AF' }),
  draft('region', 'All of Asia', { continent: 'AS' }),
  draft('region', 'Every corner of Europe', { continent: 'EU' }),
  draft('region', 'Oceania, island by island', { continent: 'OC' }),
  draft('countries', 'Island nations', {
    countryCodes: codes(
      'is jp nz lk mg cu ph id ie mt cy fj mv jm bs mu sc ws to tt'
    ),
  }),
  draft('countries', 'The Silk Road', {
    slug: 'silk-road',
    journal: true,
    countryCodes: codes('cn kg kz uz tm tj af ir iq sy tr'),
  }),
  draft('countries', 'The Nordics', { countryCodes: codes('is no se fi dk') }),
  draft('countries', 'Along the Nile', {
    countryCodes: codes('eg sd ss et ug'),
  }),
  draft('theme', 'Stories set in the Arctic', { target: 5 }),
  draft('theme', 'Books in translation', { target: 12 }),
  draft('theme', 'Written before 1900', { target: 6 }),
];

// catalogue goals are stored by their English name and shown in the reader's language; a goal of the reader's own keeps its name
const CATALOGUE_NAME: Record<string, () => string> = {
  'Around South America': m.goals_cat_south_america,
  'Across Africa': m.goals_cat_africa,
  'All of Asia': m.goals_cat_asia,
  'Every corner of Europe': m.goals_cat_europe,
  'Oceania, island by island': m.goals_cat_oceania,
  'Island nations': m.goals_cat_islands,
  'The Silk Road': m.goals_cat_silk_road,
  'The Nordics': m.goals_cat_nordics,
  'Along the Nile': m.goals_cat_nile,
  'Stories set in the Arctic': m.goals_cat_arctic,
  'Books in translation': m.goals_cat_translation,
  'Written before 1900': m.goals_cat_before_1900,
};

/**
 * Gets the name of a goal. A catalogue goal shows in the language of the reader. A goal of the reader keeps its name.
 */
export const goalName = (name: string) => CATALOGUE_NAME[name]?.() ?? name;

export const KIND_GROUP: Record<GoalKind, () => string> = {
  region: m.goals_group_regions,
  countries: m.goals_group_countries,
  theme: m.goals_group_themes,
};

/** a catalogue goal offered to the reader, with how far their books already go into it */
export type Suggestion = { c: CatalogueGoal; p: Progress };
