import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type SubmitEvent,
} from 'react';

import type { Goal, GoalKind } from '../../../../types';
import { addGoal, updateGoal } from '../../../../api/goals/goals';
import { useDirty } from '../../../../hooks/useUnsaved';
import { continentName, type Continent } from '../../../../utils/continents';
import { getLocale } from '../../../../paraglide/runtime.js';
import { DEFAULT_THEME_TARGET, REGIONS, goalName } from '../../utils/catalogue';
import {
  goalDraft,
  validateGoal,
  type GoalProblem,
} from '../../utils/goalDraft';

type GoalForm = {
  /** the goal being edited, or null for a new one */
  goal: Goal | null;
  goals: Goal[];
  names: Record<string, string>;
  onClose: () => void;
  onSaved: (name: string) => void;
};

/** The goal dialog's form: its fields, the countries picked by name, checking and saving. Any change clears
    the error shown; the error shows next to its field, which takes focus. */
export const useGoalForm = ({
  goal,
  goals,
  names,
  onClose,
  onSaved,
}: GoalForm) => {
  const [kind, setKind] = useState<GoalKind>(goal?.kind ?? 'region');
  // a catalogue goal shows its name in the reader's language; left as it is, it keeps its stored English name
  const [name, setName] = useState(goal ? goalName(goal.name) : '');

  const [continent, setContinent] = useState<Continent>(
    goal?.continent ?? 'EU'
  );

  const [codes, setCodes] = useState<string[]>(goal?.countryCodes ?? []);
  const [country, setCountry] = useState('');

  const [target, setTarget] = useState(
    String(goal?.target ?? DEFAULT_THEME_TARGET)
  );

  const [error, setError] = useState<GoalProblem>(null);
  const [saving, setSaving] = useState(false);
  const dirty = useDirty([kind, name, continent, codes, target]);

  const byName = Object.fromEntries(
    Object.entries(names).map(([code, countryName]) => [
      countryName.toLowerCase(),
      code,
    ])
  );

  // the names to suggest, in the reader's alphabet order
  const countryNames = Object.values(names).sort((left, right) =>
    left.localeCompare(right, getLocale())
  );

  const regionOptions = REGIONS.map((region) => ({
    value: region,
    label: continentName(region),
  }));

  const addCountry = (value: string) => {
    const code = byName[value.trim().toLowerCase()];

    if (!code) return;
    if (!codes.includes(code)) setCodes([...codes, code]);
    setCountry('');
    setError(null);
  };

  const fail = (problem: NonNullable<GoalProblem>) => {
    setError(problem);
    if (problem.at) document.getElementById(problem.at)?.focus();
  };

  /** the error for one field, by its id */
  const errorAt = (id: string) => (error?.at === id ? error.text : undefined);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = { kind, name, continent, codes, target };
    const problem = validateGoal(fields, goal, goals);

    if (problem) return fail(problem);
    const draft = goalDraft(fields, goal);

    setSaving(true);

    const saveProblem = goal
      ? await updateGoal(goal.id, draft)
      : await addGoal(draft);

    setSaving(false);
    if (saveProblem) return fail({ text: saveProblem });
    onClose();
    onSaved(draft.name);
  };

  const handleKindChange = (next: GoalKind) => {
    setKind(next);
    setError(null);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError(null);
  };

  // Enter in the country field adds what's typed rather than submitting the form
  const handleCountryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    addCountry(country);
  };

  const handleCountryRemove = (code: string) =>
    setCodes(codes.filter((other) => other !== code));

  const handleTargetChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTarget(event.target.value);
    setError(null);
  };

  return {
    kind,
    name,
    continent,
    setContinent,
    codes,
    country,
    setCountry,
    target,
    error,
    saving,
    dirty,
    countryNames,
    regionOptions,
    addCountry,
    errorAt,
    submit,
    handleKindChange,
    handleNameChange,
    handleCountryKeyDown,
    handleCountryRemove,
    handleTargetChange,
  };
};
