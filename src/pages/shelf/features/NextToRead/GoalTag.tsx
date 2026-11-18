import * as styles from '../../ShelfPage.css';

/**
 * Shows a goal that a book to read next would move forward.
 */
const GoalTag = ({ name }: { name: string }) => (
  <span className={styles.nextGoal}>{name}</span>
);

export default GoalTag;
