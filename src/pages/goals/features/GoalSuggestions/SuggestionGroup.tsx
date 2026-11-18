import type { GoalKind } from '../../../../types';
import {
  KIND_GROUP,
  type CatalogueGoal,
  type Suggestion,
} from '../../utils/catalogue';
import * as styles from '../../GoalsPage.css';
import GoalChip from './GoalChip';

type SuggestionGroupProps = {
  kind: GoalKind;
  items: Suggestion[];
  /** the reader already has the most goals */
  disabled: boolean;
  onAdd: (goal: CatalogueGoal) => void;
};

/**
 * Shows one kind of goal under More goals: its heading and its goals.
 */
const SuggestionGroup = ({
  kind,
  items,
  disabled,
  onAdd,
}: SuggestionGroupProps) => {
  return (
    <div className={styles.group}>
      <h3>{KIND_GROUP[kind]()}</h3>
      <ul className={styles.chips}>
        {items.map(({ c, p }) => (
          <GoalChip
            key={c.name}
            goal={c}
            progress={p}
            disabled={disabled}
            onAdd={onAdd}
          />
        ))}
      </ul>
    </div>
  );
};

export default SuggestionGroup;
