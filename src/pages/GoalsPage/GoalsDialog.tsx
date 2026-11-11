import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { CheckIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import Field from '../../components/Field/Field';
import type { Goal, GoalKind } from '../../types';
import { continentName, type Continent } from '../../utils/continents';
import { addGoal, updateGoal } from '../../api/goals/goals';
import { MAX_GOALS, REGIONS, goalName } from './goals';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import * as a from '../account/features/DeleteAccount/DeleteAccount.css';
import * as s from './GoalsPage.css';
import Hint from '../../components/Hint/Hint';
import { Button } from '../../components/Button/Button';

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
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
    document.getElementById(goal ? 'g-name' : 'g-kind')?.focus();
  }, [goal]);

  const byName = Object.fromEntries(
    Object.entries(names).map(([code, n]) => [n.toLowerCase(), code])
  );

  const addCountry = (value: string) => {
    const code = byName[value.trim().toLowerCase()];

    if (!code) return;
    if (!codes.includes(code)) setCodes([...codes, code]);
    setCountry('');
    setError(undefined);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) return setError(m.goals_err_name());
    if (
      goals.some(
        (g) =>
          g.id !== goal?.id &&
          [g.name, goalName(g.name)].some(
            (n) => n.toLowerCase() === trimmed.toLowerCase()
          )
      )
    )
      return setError(m.goals_err_dup({ name: trimmed }));
    if (kind === 'countries' && codes.length < 2)
      return setError(m.goals_err_two());
    if (kind === 'theme' && !(Number(target) >= 1))
      return setError(m.goals_err_target());
    if (!goal && goals.length >= MAX_GOALS) return setError(m.goals_full());

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
    if (problem) return setError(problem);
    dialog.current?.close();
    onSaved(draft.name);
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={a.dialog}
        aria-labelledby="goal-dialog-title"
        onClose={onClose}
        onClick={(event) =>
          event.target === event.currentTarget && dialog.current?.close()
        }
      >
        <form onSubmit={submit} noValidate>
          <div className={a.dialogHead}>
            <h2 className={a.dialogTitle} id="goal-dialog-title">
              {goal ? m.goals_dialog_edit() : m.goals_dialog_new()}
            </h2>
            <button
              type="button"
              className={a.close}
              aria-label={m.common_close()}
              onClick={() => dialog.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="g-kind">
              {m.goals_kind_label()}
            </label>
            <select
              id="g-kind"
              className={s.input}
              value={kind}
              disabled={!!goal}
              onChange={(e) => setKind(e.target.value as GoalKind)}
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
            onChange={(e) => {
              setName(e.target.value);
              setError(undefined);
            }}
          />

          {kind === 'region' && (
            <div className={s.field}>
              <label className={s.label} htmlFor="g-region">
                {m.goals_region()}
              </label>
              <select
                id="g-region"
                className={s.input}
                value={continent}
                onChange={(e) => setContinent(e.target.value as Continent)}
              >
                {REGIONS.map((c) => (
                  <option key={c} value={c}>
                    {continentName(c)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kind === 'countries' && (
            <div className={s.field}>
              <label className={s.label} htmlFor="g-country">
                {m.goals_countries()}
              </label>
              <input
                id="g-country"
                className={s.input}
                list="g-countries"
                placeholder={m.goals_country_placeholder()}
                autoComplete="off"
                aria-describedby="g-country-hint"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  // picking from the list fills in a whole name at once (not typed): add it straight away
                  if ((e.nativeEvent as InputEvent).inputType !== 'insertText')
                    addCountry(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCountry(country);
                  }
                }}
              />
              <datalist id="g-countries">
                {Object.values(names)
                  .sort((x, y) => x.localeCompare(y, getLocale()))
                  .map((n) => (
                    <option key={n} value={n} />
                  ))}
              </datalist>
              <Hint id="g-country-hint">{m.goals_country_hint()}</Hint>
              {codes.length > 0 && (
                <ul className={s.picked}>
                  {codes.map((code) => (
                    <li key={code}>
                      {names[code] ?? code}
                      <button
                        type="button"
                        aria-label={m.goals_remove_country({
                          country: names[code] ?? code,
                        })}
                        onClick={() =>
                          setCodes(codes.filter((c) => c !== code))
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
              onChange={(e) => setTarget(e.target.value)}
            />
          )}

          {error && (
            <p className={s.formError} role="alert">
              {error}
            </p>
          )}

          <div className={a.dialogActions}>
            <Button
              type="button"
              variant="text"
              onClick={() => dialog.current?.close()}
            >
              {m.common_cancel()}
            </Button>
            <Button type="submit" disabled={saving}>
              {goal ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <PlusIcon aria-hidden="true" />
              )}
              {goal ? m.goals_save_changes() : m.goals_add_goal()}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default GoalDialog;
