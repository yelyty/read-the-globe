import { createElement, type ReactNode } from 'react';
import type { Feature } from 'geojson';
import type { BookEntry, Goal, GoalKind } from '../../types';
import type { Marks } from '../../utils/atlasMarks';
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  type Continent,
} from '../../utils/continents';
import { toNumeric } from '../../utils/toIsoNumeric';
import { m } from '../../paraglide/messages.js';

export const MAX_GOALS = 10;

export const REGIONS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
  (c) => c !== 'AN'
);

export type GoalDraft = Pick<
  Goal,
  'kind' | 'name' | 'continent' | 'countryCodes' | 'target'
>;

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

const codes = (alpha2: string) => alpha2.split(' ').map((c) => toNumeric(c)!);

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

export const goalName = (name: string) => CATALOGUE_NAME[name]?.() ?? name;

export const KIND_GROUP: Record<GoalKind, () => string> = {
  region: m.goals_group_regions,
  countries: m.goals_group_countries,
  theme: m.goals_group_themes,
};

/** a message's **bold** parts as <b> */
export const withBold = (text: string): ReactNode[] =>
  text
    .split('**')
    .map((part, i) => (i % 2 ? createElement('b', { key: i }, part) : part));

export type Progress = {
  done: number;
  total: number;
  all: string[];
  reached: string[];
};

export function goalProgress(
  goal: GoalDraft & { id?: number },
  marks: Marks,
  books: BookEntry[],
  shapes: Record<string, Feature>
): Progress {
  if (goal.kind === 'theme') {
    const done = books.filter((b) =>
      b.goals?.some((g) => g.goalId === goal.id)
    ).length;

    return { done, total: goal.target ?? 1, all: [], reached: [] };
  }

  const all =
    goal.kind === 'region'
      ? Object.keys(shapes).filter((c) => CONTINENT_OF[c] === goal.continent)
      : (goal.countryCodes ?? []);

  const reached = all.filter((c) => marks[c]);

  return { done: reached.length, total: all.length, all, reached };
}

export const isDone = (p: Progress) => p.total > 0 && p.done >= p.total;

export const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const goalHas = (goal: Goal, code: string) =>
  goal.kind === 'region'
    ? CONTINENT_OF[code] === goal.continent
    : goal.kind === 'countries' && !!goal.countryCodes?.includes(code);

// the postmark's date, for a reached goal's stamp: "4 X 26"
export const romanDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);

  const months = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ];

  return `${d.getDate()} ${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
};
