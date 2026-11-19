import Sticker from './Sticker';
import * as styles from './Sticker.css';

/**
 * Shows a stack of four books with a pennant on top, for a reading goal that is not set yet.
 *
 * Original artwork © 2026 Líza Tymošenko. All rights reserved; refer to LICENSE.
 */
const GoalsSticker = () => (
  <Sticker>
    <rect
      className={styles.shelfBookRust}
      x="20"
      y="77.7"
      width="79.9"
      height="12.3"
      rx="1.3"
    />
    <rect
      className={styles.shelfBookOlive}
      x="23.5"
      y="63.9"
      width="73"
      height="12.2"
      rx="1.3"
    />
    <rect
      className={styles.goalBookSoftRust}
      x="33.7"
      y="39.2"
      width="53.4"
      height="7.7"
      rx="1.3"
    />
    <rect
      className={styles.shelfBookPale}
      x="30.3"
      y="48.5"
      width="60.3"
      height="14"
      rx="1.3"
    />
    <path
      className={styles.shelfBand}
      d="M24.7 79.1 h1.8 v9.6 h-1.8 Z M93.7 79.1 h1.8 v9.6 h-1.8 Z M28.7 65.3 h1.8 v9.6 h-1.8 Z M89.3 65.3 h1.8 v9.6 h-1.8 Z M32.5 49.9 h1.9 v11.2 h-1.9 Z M85.8 49.9 h1.9 v11.2 h-1.9 Z M36 40.5 h1.6 v5.3 h-1.6 Z M83.1 40.6 h1.6 v5.3 h-1.6 Z"
    />
    <rect
      className={styles.goalFlag}
      x="48"
      y="6.4"
      width="2.1"
      height="31.3"
    />
    <path
      className={styles.goalFlag}
      d="M66.3 17.4 L81.5 6.4 H50.1 V27.8 H81.5 Z"
    />
  </Sticker>
);

export default GoalsSticker;
