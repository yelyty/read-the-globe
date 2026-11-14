import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type SubmitEvent,
} from 'react';
import { CheckIcon, PlusIcon, XIcon } from '@phosphor-icons/react';

import Field from '../../components/Field/Field';
import Select from '../../components/Select/Select';
import Suggest from '../../components/Suggest/Suggest';
import type { Goal, GoalKind } from '../../types';
import { continentName, type Continent } from '../../utils/continents';
import { addGoal, updateGoal } from '../../api/goals/goals';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import { fieldError } from '../../components/Field/Field.css';
import Hint from '../../components/Hint/Hint';
import { Button } from '../../components/Button/Button';
import { useDirty } from '../../hooks/useUnsaved';
import Dialog from '../../components/Dialog/Dialog';
import DialogActions from '../../components/Dialog/DialogActions';
import {
  DEFAULT_THEME_TARGET,
  MAX_GOALS,
  MAX_THEME_TARGET,
  REGIONS,
  goalName,
} from './goals';
import * as styles from './GoalsPage.css';

const NAME_HINT: Record<GoalKind, () => string> = {
  region: m.goals_cat_europe,
  countries: m.goals_name_hint_countries,
  theme: m.goals_cat_translation,
};

type GoalDialogProps = {
  goal: Goal | null;
  goals: Goal[];
  names: Record<string, string>;
  onClose: () => void;
  onSaved: (name: string) => void;
};

const GoalDialog = ({
  goal,
  goals,
  names,
  onClose,
  onSaved,
}: GoalDialogProps) => {
  const [kind, setKind] = useState<GoalKind>(goal?.kind ?? 'region');
  // a catalogue goal shows its name in the reader's language; left as it is, it keeps its stored English name
  const shownName = goal ? goalName(goal.name) : '';
  const [name, setName] = useState(shownName);

  const [continent, setContinent] = useState<Continent>(
    goal?.continent ?? 'EU'
  );

  const [codes, setCodes] = useState<string[]>(goal?.countryCodes ?? []);
  const [country, setCountry] = useState('');

  const [target, setTarget] = useState(
    String(goal?.target ?? DEFAULT_THEME_TARGET)
  );

  // `at` names the field the error is about; without it the error is about the whole form
  const [error, setError] = useState<{ text: string; at?: string }>();
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

  const addCountry = (value: string) => {
    const code = byName[value.trim().toLowerCase()];

    if (!code) return;
    if (!codes.includes(code)) setCodes([...codes, code]);
    setCountry('');
    setError(undefined);
  };

  // the error shows next to its field, which takes focus
  const fail = (text: string, at?: string) => {
    setError({ text, at });
    if (at) document.getElementById(at)?.focus();
  };

  const errorAt = (id: string) => (error?.at === id ? error.text : undefined);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) return fail(m.goals_err_name(), 'g-name');
    if (
      goals.some(
        (existing) =>
          existing.id !== goal?.id &&
          [existing.name, goalName(existing.name)].some(
            (countryName) => countryName.toLowerCase() === trimmed.toLowerCase()
          )
      )
    )
      return fail(m.goals_err_dup({ name: trimmed }), 'g-name');
    if (kind === 'countries' && codes.length < 2)
      return fail(m.goals_err_two(), 'g-country');
    if (kind === 'theme' && !(Number(target) >= 1))
      return fail(m.goals_err_target(), 'g-target');
    if (!goal && goals.length >= MAX_GOALS) return fail(m.goals_full());

    const draft = {
      kind,
      name: goal && trimmed === shownName ? goal.name : trimmed,
      continent: kind === 'region' ? continent : null,
      countryCodes: kind === 'countries' ? codes : null,
      target:
        kind === 'theme'
          ? Math.min(MAX_THEME_TARGET, Math.round(Number(target)))
          : null,
    };

    setSaving(true);

    const problem = goal
      ? await updateGoal(goal.id, draft)
      : await addGoal(draft);

    setSaving(false);
    if (problem) return fail(problem);
    onClose();
    onSaved(draft.name);
  };

  /* ---------- handlers: any change clears the error shown ---------- */
  const handleKindChange = (next: GoalKind) => {
    setKind(next);
    setError(undefined);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError(undefined);
  };

  // Enter in the country field adds what's typed rather than submitting the form
  const handleCountryKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    addCountry(country);
  };

  const handleCountryRemove = (code: string) => () =>
    setCodes(codes.filter((other) => other !== code));

  const handleTargetChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTarget(event.target.value);
    setError(undefined);
  };

  const regionOptions = REGIONS.map((region) => ({
    value: region,
    label: continentName(region),
  }));

  // a country chosen for the goal, with the way to take it off again
  const renderPicked = (code: string) => (
    <li key={code}>
      {names[code] ?? code}
      <button
        type="button"
        aria-label={m.goals_remove_country({ country: names[code] ?? code })}
        onClick={handleCountryRemove(code)}
      >
        <XIcon aria-hidden="true" />
      </button>
    </li>
  );

  return (
    <Dialog
      open
      onClose={onClose}
      title={goal ? m.goals_dialog_edit() : m.goals_dialog_new()}
      initialFocus={goal ? 'g-name' : 'g-kind'}
      dirty={dirty}
    >
      <form onSubmit={submit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="g-kind" id="g-kind-label">
            {m.goals_kind_label()}
          </label>
          <Select<GoalKind>
            id="g-kind"
            labelId="g-kind-label"
            value={kind}
            disabled={!!goal}
            onChange={handleKindChange}
            options={[
              { value: 'region', label: m.goals_kind_region() },
              { value: 'countries', label: m.goals_kind_countries() },
              { value: 'theme', label: m.goals_kind_theme() },
            ]}
          />
        </div>

        <Field
          id="g-name"
          label={m.goals_name()}
          maxLength={80}
          placeholder={NAME_HINT[kind]()}
          autoComplete="off"
          value={name}
          error={errorAt('g-name')}
          onChange={handleNameChange}
        />

        {kind === 'region' && (
          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="g-region"
              id="g-region-label"
            >
              {m.goals_region()}
            </label>
            <Select<Continent>
              id="g-region"
              labelId="g-region-label"
              value={continent}
              onChange={setContinent}
              options={regionOptions}
            />
          </div>
        )}

        {kind === 'countries' && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="g-country">
              {m.goals_countries()}
            </label>
            <Suggest
              id="g-country"
              className={styles.input}
              options={countryNames}
              placeholder={m.goals_country_placeholder()}
              autoComplete="off"
              aria-describedby={
                errorAt('g-country')
                  ? 'g-country-hint g-country-err'
                  : 'g-country-hint'
              }
              aria-invalid={errorAt('g-country') ? true : undefined}
              value={country}
              onValue={setCountry}
              // a name picked from the list goes straight onto the goal
              onPick={addCountry}
              onKeyDown={handleCountryKeyDown}
            />
            <Hint id="g-country-hint">{m.goals_country_hint()}</Hint>
            {errorAt('g-country') && (
              <p id="g-country-err" className={fieldError}>
                {errorAt('g-country')}
              </p>
            )}
            {codes.length > 0 && (
              <ul className={styles.picked}>{codes.map(renderPicked)}</ul>
            )}
          </div>
        )}

        {kind === 'theme' && (
          <Field
            id="g-target"
            label={m.goals_target()}
            type="number"
            min={1}
            max={MAX_THEME_TARGET}
            inputMode="numeric"
            value={target}
            error={errorAt('g-target')}
            onChange={handleTargetChange}
          />
        )}

        {error && !error.at && (
          <p className={styles.formError} role="alert">
            {error.text}
          </p>
        )}

        <DialogActions>
          <Button type="button" variant="text" onClick={onClose}>
            {m.common_cancel()}
          </Button>
          <Button
            type="submit"
            disabled={saving}
            aria-busy={saving || undefined}
          >
            {goal ? (
              <CheckIcon aria-hidden="true" />
            ) : (
              <PlusIcon aria-hidden="true" />
            )}
            {saving
              ? goal
                ? m.log_saving()
                : m.goals_adding()
              : goal
                ? m.goals_save_changes()
                : m.goals_add_goal()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GoalDialog;
