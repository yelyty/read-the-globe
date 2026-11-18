import { CheckIcon, PlusIcon } from '@phosphor-icons/react';

import Field from '../../../../components/Field/Field';
import Select from '../../../../components/Select/Select';
import Suggest from '../../../../components/Suggest/Suggest';
import type { Goal, GoalKind } from '../../../../types';
import type { Continent } from '../../../../utils/continents';
import { m } from '../../../../paraglide/messages.js';
import Hint from '../../../../components/Hint/Hint';
import { Button } from '../../../../components/Button/Button';
import Dialog from '../../../../components/Dialog/Dialog';
import DialogActions from '../../../../components/Dialog/DialogActions';
import { MAX_THEME_TARGET } from '../../utils/catalogue';
import * as styles from '../../GoalsPage.css';
import PickedCountry from './PickedCountry';
import { useGoalForm } from './useGoalForm';

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

/**
 * Shows the dialog to add a goal or to edit one.
 * @param goal - The goal to edit, or null for a new goal.
 * @param onSaved - Called with the name of the goal after it is saved.
 */
const GoalDialog = ({
  goal,
  goals,
  names,
  onClose,
  onSaved,
}: GoalDialogProps) => {
  const {
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
  } = useGoalForm({ goal, goals, names, onClose, onSaved });

  const countryControl = (
    <Suggest
      options={countryNames}
      placeholder={m.goals_country_placeholder()}
      autoComplete="off"
      value={country}
      onValue={setCountry}
      // a name picked from the list goes straight onto the goal
      onPick={addCountry}
      onKeyDown={handleCountryKeyDown}
    />
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
          <Field
            id="g-country"
            label={m.goals_countries()}
            error={errorAt('g-country')}
            aria-describedby="g-country-hint"
            control={countryControl}
            below={
              codes.length > 0 && (
                <ul className={styles.picked}>
                  {codes.map((code) => (
                    <PickedCountry
                      key={code}
                      code={code}
                      name={names[code] ?? code}
                      onRemove={handleCountryRemove}
                    />
                  ))}
                </ul>
              )
            }
          >
            <Hint id="g-country-hint">{m.goals_country_hint()}</Hint>
          </Field>
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
