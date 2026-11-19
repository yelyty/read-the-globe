import Sticker from './Sticker';
import * as styles from './Sticker.css';

/**
 * Shows a potted plant beside three empty book outlines on a shelf, for a next read that is not picked yet.
 *
 * Original artwork © 2026 Líza Tymošenko. All rights reserved; refer to LICENSE.
 */
const NextReadSticker = () => (
  <Sticker>
    <rect
      className={styles.shelfPlank}
      x="5.2"
      y="85.8"
      width="109.5"
      height="4.2"
      rx="1"
    />
    <rect
      className={styles.nextBookRust}
      x="53.7"
      y="22.4"
      width="15.3"
      height="63.4"
      rx="1.3"
    />
    <rect
      className={styles.nextBookPale}
      x="71.5"
      y="16"
      width="14.5"
      height="69.8"
      rx="1.3"
    />
    <rect
      className={styles.nextBookOlive}
      x="88"
      y="27.5"
      width="14.2"
      height="58.3"
      rx="1.3"
    />
    <path
      className={styles.shelfLeaf}
      d="M30.9 66.3 C30.9 66.3 46.5 50 50.8 41.8 C52.4 38.9 51.3 35.2 48.3 33.6 C45.3 32 41.7 33.2 40.1 36.1 C35.7 44.3 30.9 66.3 30.9 66.3 Z"
    />
    <path
      className={styles.shelfLeaf}
      d="M31 68.5 C31 68.5 37 40.5 37.1 28.4 C37.1 25.2 34.5 22.6 31.3 22.6 C28.1 22.6 25.4 25.2 25.4 28.4 C25.3 40.4 31 68.5 31 68.5 Z"
    />
    <path
      className={styles.shelfLeaf}
      d="M29.7 67 C29.7 67 28.9 50.6 26 44.9 C24.1 41.5 19.9 40.1 16.4 42 C13 43.8 11.7 48.1 13.5 51.5 C16.5 57.1 29.7 67 29.7 67 Z"
    />
    <path
      className={styles.nextPot}
      d="M43.9 63.5 H18.3 V83.2 C18.3 84.6 19.4 85.8 20.8 85.8 H41.4 C42.8 85.8 43.9 84.6 43.9 83.2 Z"
    />
  </Sticker>
);

export default NextReadSticker;
