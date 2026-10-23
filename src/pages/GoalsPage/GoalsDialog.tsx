import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { CheckIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import Field from '../../components/Field/Field';
import type { Goal, GoalKind } from '../../types';
import { CONTINENT_NAMES, type Continent } from '../../utils/continents';
import { addGoal, updateGoal } from '../../api/goals/goals';
import { MAX_GOALS, REGIONS } from './goals';
import * as a from '../account/features/DeleteAccount/DeleteAccount.css';
import * as s from './GoalsPage.css';
import Hint from '../../components/Hint/Hint';
import { Button } from '../../components/Button/Button';

const NAME_HINT: Record<GoalKind, string> = {
  region: 'Every corner of Europe',
  countries: 'Along the Danube',
  theme: 'Books in translation',
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
  const [name, setName] = useState(goal?.name ?? '');
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
    if (!trimmed) return setError('Give the goal a name.');
    if (
      goals.some(
        (g) =>
          g.id !== goal?.id && g.name.toLowerCase() === trimmed.toLowerCase()
      )
    )
      return setError(
        `You already have a goal called “${trimmed}”. Pick another name.`
      );
    if (kind === 'countries' && codes.length < 2)
      return setError('Add at least two countries.');
    if (kind === 'theme' && !(Number(target) >= 1))
      return setError('Choose how many books, 1 or more.');
    if (!goal && goals.length >= MAX_GOALS)
      return setError('Ten goals is plenty. Remove one to add another.');

    const draft = {
      kind,
      name: trimmed,
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
    onSaved(trimmed);
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
              {goal ? 'Edit goal' : 'Make your own goal'}
            </h2>
            <button
              type="button"
              className={a.close}
              aria-label="Close"
              onClick={() => dialog.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="g-kind">
              Type of goal
            </label>
            <select
              id="g-kind"
              className={s.input}
              value={kind}
              disabled={!!goal}
              onChange={(e) => setKind(e.target.value as GoalKind)}
            >
              <option value="region">Region — a whole continent</option>
              <option value="countries">Countries — a list you choose</option>
              <option value="theme">Theme — books you choose yourself</option>
            </select>
          </div>

          <Field
            id="g-name"
            label="Name"
            maxLength={80}
            placeholder={NAME_HINT[kind]}
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
                Region
              </label>
              <select
                id="g-region"
                className={s.input}
                value={continent}
                onChange={(e) => setContinent(e.target.value as Continent)}
              >
                {REGIONS.map((c) => (
                  <option key={c} value={c}>
                    {CONTINENT_NAMES[c]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {kind === 'countries' && (
            <div className={s.field}>
              <label className={s.label} htmlFor="g-country">
                Countries
              </label>
              <input
                id="g-country"
                className={s.input}
                list="g-countries"
                placeholder="Iceland"
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
                  .sort((x, y) => x.localeCompare(y))
                  .map((n) => (
                    <option key={n} value={n} />
                  ))}
              </datalist>
              <Hint id="g-country-hint">
                Pick from the list, or press Enter after each country.
              </Hint>
              {codes.length > 0 && (
                <ul className={s.picked}>
                  {codes.map((code) => (
                    <li key={code}>
                      {names[code] ?? code}
                      <button
                        type="button"
                        aria-label={`Remove ${names[code] ?? code}`}
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
              label="How many books"
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
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {goal ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <PlusIcon aria-hidden="true" />
              )}
              {goal ? 'Save changes' : 'Add goal'}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default GoalDialog;
