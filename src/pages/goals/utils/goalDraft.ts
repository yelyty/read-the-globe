import type { Goal, GoalKind } from '../../../types';
import type { Continent } from '../../../utils/continents';
import { m } from '../../../paraglide/messages.js';
import { MAX_GOALS, MAX_THEME_TARGET, goalName } from './catalogue';
import type { GoalDraft } from './goalProgress';

/** what the goal dialog's form holds */
export type GoalFields = {
  kind: GoalKind;
  name: string;
  continent: Continent;
  codes: string[];
  /** as typed: the theme's number of books */
  target: string;
};

/** what's wrong with the form, said next to the field it's about (at: the field's id), or null */
export type GoalProblem = { text: string; at?: string } | null;

// a countries goal needs at least this many to be more than one country
const MIN_COUNTRIES = 2;

/** checks the form against the reader's other goals; `goal` is the one being edited, null for a new one */
export function validateGoal(
  fields: GoalFields,
  goal: Goal | null,
  goals: Goal[]
): GoalProblem {
  const trimmed = fields.name.trim();

  if (!trimmed) return { text: m.goals_err_name(), at: 'g-name' };

  // a catalogue goal is stored in English and shown in the reader's language: either name is taken
  const taken = goals.some(
    (existing) =>
      existing.id !== goal?.id &&
      [existing.name, goalName(existing.name)].some(
        (existingName) => existingName.toLowerCase() === trimmed.toLowerCase()
      )
  );

  if (taken) return { text: m.goals_err_dup({ name: trimmed }), at: 'g-name' };
  if (fields.kind === 'countries' && fields.codes.length < MIN_COUNTRIES)
    return { text: m.goals_err_two(), at: 'g-country' };
  if (fields.kind === 'theme' && !(Number(fields.target) >= 1))
    return { text: m.goals_err_target(), at: 'g-target' };
  if (!goal && goals.length >= MAX_GOALS) return { text: m.goals_full() };

  return null;
}

/** the form as a goal to save; a catalogue goal's name left as shown keeps its stored English name */
export function goalDraft(fields: GoalFields, goal: Goal | null): GoalDraft {
  const trimmed = fields.name.trim();
  const { kind } = fields;

  return {
    kind,
    name: goal && trimmed === goalName(goal.name) ? goal.name : trimmed,
    continent: kind === 'region' ? fields.continent : null,
    countryCodes: kind === 'countries' ? fields.codes : null,
    target:
      kind === 'theme'
        ? Math.min(MAX_THEME_TARGET, Math.round(Number(fields.target)))
        : null,
  };
}
