import { describe, expect, it } from 'vitest';

import { CONTINENT_NAMES } from '../../../utils/continents';
import { m } from '../../../paraglide/messages.js';
import {
  CATALOGUE,
  DEFAULT_THEME_TARGET,
  goalName,
  KIND_GROUP,
  MAX_THEME_TARGET,
  REGIONS,
} from './catalogue';

describe('the catalogue', () => {
  it('offers every continent but Antarctica as a region', () => {
    expect(REGIONS).not.toContain('AN');
    expect(REGIONS).toHaveLength(Object.keys(CONTINENT_NAMES).length - 1);
  });

  it('fills in only the field each kind of goal uses', () => {
    for (const goal of CATALOGUE) {
      expect(goal.continent !== null, goal.name).toBe(goal.kind === 'region');

      expect(goal.countryCodes !== null, goal.name).toBe(
        goal.kind === 'countries'
      );

      expect(goal.target !== null, goal.name).toBe(goal.kind === 'theme');
    }
  });

  it('knows every country it names', () => {
    for (const goal of CATALOGUE)
      for (const code of goal.countryCodes ?? [])
        expect(code, goal.name).toMatch(/^\d{3}$/);
  });

  it('gives each goal its own name', () => {
    const names = CATALOGUE.map((goal) => goal.name.toLowerCase());

    expect(new Set(names).size).toBe(names.length);
  });

  it('sets theme targets within what the form allows', () => {
    expect(DEFAULT_THEME_TARGET).toBeLessThanOrEqual(MAX_THEME_TARGET);

    for (const goal of CATALOGUE.filter((each) => each.kind === 'theme')) {
      expect(goal.target).toBeGreaterThan(0);
      expect(goal.target).toBeLessThanOrEqual(MAX_THEME_TARGET);
    }
  });

  it('links the Silk Road from the Journal', () => {
    const silk = CATALOGUE.find((goal) => goal.slug === 'silk-road');

    expect(silk?.journal).toBe(true);
    expect(silk?.kind).toBe('countries');
  });
});

describe('goalName', () => {
  // in English each catalogue goal reads as it is stored: a wrong or missing translation key would show here
  it('says each catalogue goal’s name through its message', () => {
    for (const goal of CATALOGUE) expect(goalName(goal.name)).toBe(goal.name);
  });

  it('keeps the name of a goal of the reader’s own', () => {
    expect(goalName('Books from my grandmother’s shelf')).toBe(
      'Books from my grandmother’s shelf'
    );
  });
});

describe('KIND_GROUP', () => {
  it('names a group for each kind of goal', () => {
    expect(KIND_GROUP.region()).toBe(m.goals_group_regions());
    expect(KIND_GROUP.countries()).toBe(m.goals_group_countries());
    expect(KIND_GROUP.theme()).toBe(m.goals_group_themes());
  });
});
