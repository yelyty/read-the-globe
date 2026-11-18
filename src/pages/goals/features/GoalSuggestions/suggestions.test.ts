import { describe, expect, it } from 'vitest';

import type { Goal } from '../../../../types';
import { CATALOGUE, type CatalogueGoal } from '../../utils/catalogue';
import type { Progress } from '../../utils/goalProgress';
import { suggestGoals } from './suggestions';

// how far the reader's books go into each catalogue goal, by name: done of total; anything unnamed is untouched
const progressFrom =
  (done: Record<string, [number, number]>) =>
  (goal: CatalogueGoal): Progress => {
    const [count, total] = done[goal.name] ?? [0, 10];

    return { done: count, total, all: [] } as unknown as Progress;
  };

const goal = (name: string): Goal => ({
  id: 1,
  kind: 'theme',
  name,
  continent: null,
  countryCodes: null,
  target: 5,
  reachedOn: null,
});

const names = (offers: { c: CatalogueGoal }[]) =>
  offers.map((offer) => offer.c.name);

describe('suggestGoals', () => {
  it('leaves out the goals the reader already has, whatever the case', () => {
    const { top, rest } = suggestGoals([goal('the nordics')], progressFrom({}));

    expect([...names(top), ...names(rest)]).not.toContain('The Nordics');
    expect(top.length + rest.length).toBe(CATALOGUE.length - 1);
  });

  it('picks out the goal furthest underway for a reader with no goals yet', () => {
    const { pick, top } = suggestGoals(
      [],
      progressFrom({ 'The Nordics': [4, 5], 'Along the Nile': [1, 5] })
    );

    expect(pick?.c.name).toBe('The Nordics');
    expect(names(top)).not.toContain('The Nordics');
    expect(names(top)[0]).toBe('Along the Nile');
  });

  it('picks nothing out once the reader has a goal', () => {
    const { pick, top } = suggestGoals(
      [goal('Mine')],
      progressFrom({ 'The Nordics': [4, 5] })
    );

    expect(pick).toBeUndefined();
    expect(names(top)[0]).toBe('The Nordics');
  });

  it('leads with up to four goals underway, furthest first', () => {
    const { top } = suggestGoals(
      [goal('Mine')],
      progressFrom({
        'Across Africa': [1, 10],
        'All of Asia': [2, 10],
        'The Nordics': [3, 5],
        'Along the Nile': [4, 5],
        'The Silk Road': [5, 11],
      })
    );

    expect(names(top)).toEqual([
      'Along the Nile',
      'The Nordics',
      'The Silk Road',
      'All of Asia',
    ]);
  });

  it('does not count a goal already reached as underway', () => {
    const { top } = suggestGoals(
      [goal('Mine')],
      progressFrom({ 'The Nordics': [5, 5] })
    );

    expect(names(top)[0]).not.toBe('The Nordics');
  });

  it('tops up with the first of each kind when few are underway', () => {
    const { top } = suggestGoals([goal('Mine')], progressFrom({}));

    expect(top.map((offer) => offer.c.kind)).toEqual([
      'region',
      'countries',
      'theme',
    ]);
  });

  it('folds the rest under their kind, and hides a kind with nothing left', () => {
    const themes = CATALOGUE.filter((entry) => entry.kind === 'theme').map(
      (entry) => goal(entry.name)
    );

    const { top, rest, groups } = suggestGoals(themes, progressFrom({}));

    expect(groups.map((group) => group.kind)).toEqual(['region', 'countries']);
    expect(groups.flatMap((group) => group.items)).toEqual(rest);
    expect(rest.some((offer) => top.includes(offer))).toBe(false);
  });
});
