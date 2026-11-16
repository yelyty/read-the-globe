import { describe, expect, it } from 'vitest';

import type { Goal } from '../../../types';
import { m } from '../../../paraglide/messages.js';
import { MAX_GOALS, MAX_THEME_TARGET } from './catalogue';
import { goalDraft, validateGoal, type GoalFields } from './goalDraft';

const fields = (over: Partial<GoalFields> = {}): GoalFields => ({
  kind: 'region',
  name: 'Read Europe',
  continent: 'EU',
  codes: [],
  target: '5',
  ...over,
});

const goal = (id: number, name: string): Goal => ({
  id,
  kind: 'region',
  name,
  continent: 'EU',
  countryCodes: null,
  target: null,
  reachedOn: null,
});

describe('validateGoal', () => {
  it('passes a complete goal', () => {
    expect(validateGoal(fields(), null, [])).toBeNull();
  });

  it('needs a name', () => {
    expect(validateGoal(fields({ name: '  ' }), null, [])).toEqual({
      text: m.goals_err_name(),
      at: 'g-name',
    });
  });

  it('refuses a name another goal has, in any case', () => {
    expect(
      validateGoal(fields({ name: 'read europe' }), null, [
        goal(1, 'Read Europe'),
      ])?.at
    ).toBe('g-name');
  });

  it('lets an edited goal keep its own name', () => {
    const own = goal(1, 'Read Europe');

    expect(validateGoal(fields(), own, [own])).toBeNull();
  });

  it('needs two countries for a countries goal', () => {
    expect(
      validateGoal(fields({ kind: 'countries', codes: ['250'] }), null, [])?.at
    ).toBe('g-country');
  });

  it('needs a target of at least one book for a theme', () => {
    expect(
      validateGoal(fields({ kind: 'theme', target: '0' }), null, [])?.at
    ).toBe('g-target');
  });

  it('refuses a new goal past the limit, about the whole form', () => {
    const goals = Array.from({ length: MAX_GOALS }, (_unused, i) =>
      goal(i, `Goal ${i}`)
    );

    expect(validateGoal(fields(), null, goals)).toEqual({
      text: m.goals_full(),
    });
  });
});

describe('goalDraft', () => {
  it('keeps only the fields of its kind', () => {
    expect(
      goalDraft(fields({ kind: 'countries', codes: ['250', '380'] }), null)
    ).toEqual({
      kind: 'countries',
      name: 'Read Europe',
      continent: null,
      countryCodes: ['250', '380'],
      target: null,
    });
  });

  it('rounds a theme target and caps it', () => {
    expect(
      goalDraft(fields({ kind: 'theme', target: '4.6' }), null).target
    ).toBe(5);

    expect(
      goalDraft(fields({ kind: 'theme', target: '9999' }), null).target
    ).toBe(MAX_THEME_TARGET);
  });
});
