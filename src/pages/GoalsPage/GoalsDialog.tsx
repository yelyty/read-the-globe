import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { CheckIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import Field from '../../components/Field/Field';
import type { Goal, GoalKind } from '../../types';
import { continentName, type Continent } from '../../utils/continents';
import { addGoal, updateGoal } from '../../api/goals/goals';
import { MAX_GOALS, REGIONS, goalName } from './goals';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import * as accountStyles from '../account/features/DeleteAccount/DeleteAccount.css';
import * as styles from './GoalsPage.css';
import { fieldError } from '../../components/Field/Field.css';
import Hint from '../../components/Hint/Hint';
import { Button } from '../../components/Button/Button';
import { dismiss, useDirty } from '../../hooks/useUnsaved';

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
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<GoalKind>(goal?.kind ?? 'region');
  // a catalogue goal shows its name in the reader's language; left as it is, it keeps its stored English name
  const shownName = goal ? goalName(goal.name) : '';
  const [name, setName] = useState(shownName);

  const [continent, setContinent] = useState<Continent>(
    goal?.continent ?? 'EU'
  );

  const [codes, setCodes] = useState<string[]>(goal?.countryCodes ?? []);
  const [country, setCountry] = useState('');
  const [target, setTarget] = useState(String(goal?.target ?? 5));
  // `at` names the field the error is about; without it the error is about the whole form
  const [error, setError] = useState<{ text: string; at?: string }>();
  const [saving, setSaving] = useState(false);
  const dirty = useDirty([kind, name, continent, codes, target]);

  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById(goal ? 'g-name' : 'g-kind')?.focus();
  }, [goal]);

  const byName = Object.fromEntries(
    Object.entries(names).map(([code, countryName]) => [
      countryName.toLowerCase(),
      code,
    ])
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
        kind === 'theme' ? Math.min(200, Math.round(Number(target))) : null,
    };

    setSaving(true);

    const problem = goal
      ? await updateGoal(goal.id, draft)
      : await addGoal(draft);

    setSaving(false);
    if (problem) return fail(problem);
    dialog.current?.close();
    onSaved(draft.name);
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={accountStyles.dialog}
        aria-labelledby="goal-dialog-title"
        onClose={onClose}
        onCancel={(event) => {
          event.preventDefault();
          dismiss(dialog.current, dirty);
        }}
        onClick={(event) =>
          event.target === event.currentTarget && dismiss(dialog.current, dirty)
        }
      >
        <form onSubmit={submit} noValidate>
          <div className={accountStyles.dialogHead}>
            <h2 className={accountStyles.dialogTitle} id="goal-dialog-title">
              {goal ? m.goals_dialog_edit() : m.goals_dialog_new()}
            </h2>
            <button
              type="button"
              className={accountStyles.close}
              aria-label={m.common_close()}
              onClick={() => dialog.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="g-kind">
              {m.goals_kind_label()}
            </label>
            <select
              id="g-kind"
              className={styles.input}
              value={kind}
              disabled={!!goal}
              onChange={(changeEvent) => {
                setKind(changeEvent.target.value as GoalKind);
                setError(undefined);
              }}
            >
              <option value="region">{m.goals_kind_region()}</option>
              <option value="countries">{m.goals_kind_countries()}</option>
              <option value="theme">{m.goals_kind_theme()}</option>
            </select>
          </div>

          <Field
            id="g-name"
            label={m.goals_name()}
            maxLength={80}
            placeholder={NAME_HINT[kind]()}
            autoComplete="off"
            value={name}
            error={errorAt('g-name')}
            onChange={(changeEvent) => {
              setName(changeEvent.target.value);
              setError(undefined);
            }}
          />

          {kind === 'region' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="g-region">
                {m.goals_region()}
              </label>
              <select
                id="g-region"
                className={styles.input}
                value={continent}
                onChange={(changeEvent) =>
                  setContinent(changeEvent.target.value as Continent)
                }
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {continentName(region)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kind === 'countries' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="g-country">
                {m.goals_countries()}
              </label>
              <input
                id="g-country"
                className={styles.input}
                list="g-countries"
                placeholder={m.goals_country_placeholder()}
                autoComplete="off"
                aria-describedby={
                  errorAt('g-country')
                    ? 'g-country-hint g-country-err'
                    : 'g-country-hint'
                }
                aria-invalid={errorAt('g-country') ? true : undefined}
                value={country}
                onChange={(changeEvent) => {
                  setCountry(changeEvent.target.value);
                  // picking from the list fills in a whole name at once (not typed): add it straight away
                  if (
                    (changeEvent.nativeEvent as InputEvent).inputType !==
                    'insertText'
                  )
                    addCountry(changeEvent.target.value);
                }}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === 'Enter') {
                    keyEvent.preventDefault();
                    addCountry(country);
                  }
                }}
              />
              <datalist id="g-countries">
                {Object.values(names)
                  .sort((left, right) => left.localeCompare(right, getLocale()))
                  .map((countryName) => (
                    <option key={countryName} value={countryName} />
                  ))}
              </datalist>
              <Hint id="g-country-hint">{m.goals_country_hint()}</Hint>
              {errorAt('g-country') && (
                <p id="g-country-err" className={fieldError}>
                  {errorAt('g-country')}
                </p>
              )}
              {codes.length > 0 && (
                <ul className={styles.picked}>
                  {codes.map((code) => (
                    <li key={code}>
                      {names[code] ?? code}
                      <button
                        type="button"
                        aria-label={m.goals_remove_country({
                          country: names[code] ?? code,
                        })}
                        onClick={() =>
                          setCodes(codes.filter((other) => other !== code))
                        }
                      >
                        <XIcon aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {kind === 'theme' && (
            <Field
              id="g-target"
              label={m.goals_target()}
              type="number"
              min={1}
              max={200}
              inputMode="numeric"
              value={target}
              error={errorAt('g-target')}
              onChange={(changeEvent) => {
                setTarget(changeEvent.target.value);
                setError(undefined);
              }}
            />
          )}

          {error && !error.at && (
            <p className={styles.formError} role="alert">
              {error.text}
            </p>
          )}

          <div className={accountStyles.dialogActions}>
            <Button
              type="button"
              variant="text"
              onClick={() => dialog.current?.close()}
            >
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
          </div>
        </form>
      </dialog>
    </>
  );
};

export default GoalDialog;
