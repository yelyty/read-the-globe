import Sticker from './Sticker';
import * as styles from './Sticker.css';

// a little shelf waiting for its first books, one gap kept for the next
const ShelfSticker = () => (
  <Sticker>
    <path className={styles.shelfPlank} d="M10 82 H 110" />
    <rect
      className={styles.shelfBookA}
      x="26"
      y="34"
      width="15"
      height="48"
      rx="2"
    />
    <rect
      className={styles.shelfBookB}
      x="43"
      y="24"
      width="15"
      height="58"
      rx="2"
    />
    <rect
      className={styles.shelfBookC}
      x="72"
      y="38"
      width="15"
      height="48"
      rx="2"
      transform="rotate(-14 72 86)"
    />
    <path className={styles.shelfBandA} d="M26 44 H 41" />
    <path className={styles.shelfBandB} d="M43 34 H 58 M43 72 H 58" />
    <rect
      className={styles.shelfGap}
      x="90"
      y="40"
      width="14"
      height="42"
      rx="2"
    />
  </Sticker>
);

export default ShelfSticker;
