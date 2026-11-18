import * as styles from '../GoalsPage.css';

/**
 * Shows a small compass. It is decorative.
 */
const Compass = () => (
  <svg
    className={styles.compass}
    viewBox="-12 -12 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle r="8.5" />
    <path className={styles.compassNorth} d="M0-11 2.2-1.6 0 0-2.2-1.6Z" />
    <path d="M0 11 2.2 1.6 0 0-2.2 1.6ZM11 0 1.6 2.2 0 0 1.6-2.2ZM-11 0-1.6 2.2 0 0-1.6-2.2Z" />
  </svg>
);

export default Compass;
