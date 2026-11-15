import { PlusIcon } from '@phosphor-icons/react';

import { m } from '../../paraglide/messages.js';
import { goalName, type CatalogueGoal } from './catalogue';
import { type Progress } from './goalProgress';
import * as styles from './GoalsPage.css';

type GoalChipProps = {
  goal: CatalogueGoal;
  progress: Progress;
  /** the reader already has the most goals */
  disabled: boolean;
  onAdd: (goal: CatalogueGoal) => void;
};

// a goal under More goals: its name, and how far the reader's books already go into a place goal
const GoalChip = ({ goal, progress, disabled, onAdd }: GoalChipProps) => {
  const handleClick = () => onAdd(goal);

  return (
    <li>
      <button
        type="button"
        className={styles.chip}
        disabled={disabled}
        onClick={handleClick}
      >
        <PlusIcon aria-hidden="true" />
        {goalName(goal.name)}
        {progress.done > 0 && goal.kind !== 'theme' && (
          <span className={styles.chipNote}>
            {m.goals_already({ done: progress.done, total: progress.total })}
          </span>
        )}
      </button>
    </li>
  );
};

export default GoalChip;
