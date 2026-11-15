import * as styles from '../ShelfPage.css';

// a goal a book to read next would move along
const GoalTag = ({ name }: { name: string }) => (
  <span className={styles.nextGoal}>{name}</span>
);

export default GoalTag;
