import Sticker from './Sticker';
import * as styles from './Sticker.css';

/**
 * Shows a flag on a hilltop at the end of a dashed path, for a goal that is not set yet.
 */
const HilltopSticker = () => (
  <Sticker>
    <path
      className={styles.hillHill}
      d="M6 88 C 26 70, 44 58, 64 52 C 82 47, 100 56, 114 88 Z"
    />
    <path
      className={styles.road}
      d="M14 86 C 30 80, 34 74, 46 70 C 58 66, 56 60, 66 56"
    />
    <circle className={styles.hillStart} cx="14" cy="86" r="3" />
    <path className={styles.hillPole} d="M66 56 V 18" />
    <path className={styles.hillCloth} d="M66 19 H 92 L 84 28 L 92 37 H 66 Z" />
  </Sticker>
);

export default HilltopSticker;
