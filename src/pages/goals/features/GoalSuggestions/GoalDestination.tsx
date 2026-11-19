import { PlusIcon } from '@phosphor-icons/react';
import type { Feature } from 'geojson';

import type { Marks } from '../../../../utils/atlasMarks';
import { m } from '../../../../paraglide/messages.js';
import GoalPlate from '../../components/GoalPlate';
import GoalShelf from '../../components/GoalShelf';
import { goalName, type CatalogueGoal } from '../../utils/catalogue';
import { type Progress } from '../../utils/goalProgress';
import * as styles from '../../GoalsPage.css';

type GoalDestinationProps = {
  goal: CatalogueGoal;
  progress: Progress;
  marks: Marks;
  shapes: Record<string, Feature>;
  /** the reader already has the most goals */
  disabled: boolean;
  onAdd: (goal: CatalogueGoal) => void;
};

/**
 * Shows a suggested goal that the books of the reader already go into: its plate (or shelf), name, progress, and Add.
 */
const GoalDestination = ({
  goal,
  progress,
  marks,
  shapes,
  disabled,
  onAdd,
}: GoalDestinationProps) => {
  const handleClick = () => onAdd(goal);

  const note = progress.done
    ? m.goals_already({ done: progress.done, total: progress.total })
    : goal.kind === 'theme'
      ? m.count_book({ count: progress.total })
      : m.count_country({ count: progress.total });

  return (
    <li>
      <button
        type="button"
        className={styles.dest}
        disabled={disabled}
        onClick={handleClick}
      >
        <span className={styles.destMap}>
          {goal.kind === 'theme' ? (
            <GoalShelf done={0} total={goal.target!} />
          ) : (
            <GoalPlate
              codes={progress.all}
              marks={marks}
              shapes={shapes}
              continent={goal.continent}
            />
          )}
        </span>
        <span className={styles.destName}>{goalName(goal.name)}</span>
        <span className={styles.destNote}>{note}</span>
        <span className={styles.destAdd}>
          <PlusIcon aria-hidden="true" />
          {m.goals_add_goal()}
        </span>
      </button>
    </li>
  );
};

export default GoalDestination;
