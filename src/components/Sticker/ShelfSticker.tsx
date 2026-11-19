import Sticker from './Sticker';
import * as styles from './Sticker.css';

/**
 * Shows a short shelf with three books and a potted plant, for a shelf that has no books yet.
 *
 * Original artwork © 2026 Líza Tymošenko. All rights reserved; refer to LICENSE.
 */
const ShelfSticker = () => (
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
      className={styles.shelfBookRust}
      x="50.2"
      y="22.4"
      width="15.3"
      height="63.4"
      rx="1.3"
    />
    <rect
      className={styles.shelfBookOlive}
      x="18.7"
      y="27.5"
      width="14.2"
      height="58.3"
      rx="1.3"
    />
    <rect
      className={styles.shelfBookPale}
      x="34.3"
      y="16"
      width="14.5"
      height="69.8"
      rx="1.3"
    />
    <path
      className={styles.shelfBand}
      d="M20.4 30.7 h10.8 v1.7 h-10.8 Z M20.4 81.1 h10.8 v1.7 h-10.8 Z M36 18.1 h10.8 v1.7 h-10.8 Z M36 81.1 h10.8 v1.7 h-10.8 Z M51.6 25 h12.5 v1.7 h-12.5 Z M51.6 81.1 h12.5 v1.7 h-12.5 Z"
    />
    <path
      className={styles.shelfLeaf}
      d="M89.2 66.9 C89.2 66.9 100.5 60.2 102.7 56 C104.5 52.6 103.2 48.5 99.9 46.7 C96.6 45 92.4 46.2 90.7 49.6 C88.4 53.8 89.2 66.9 89.2 66.9 Z"
    />
    <path
      className={styles.shelfLeaf}
      d="M86.6 68.3 C86.6 68.3 92.5 56.9 92.5 52 C92.6 48.2 90 45 86.7 45 C83.5 45 80.9 48.1 80.9 51.9 C80.8 56.9 86.6 68.3 86.6 68.3 Z"
    />
    <path
      className={styles.shelfLeaf}
      d="M85.3 66.9 C85.3 66.9 86.3 53.7 84.1 49.5 C82.3 46.2 78.1 44.9 74.6 46.8 C71.2 48.6 69.8 52.7 71.6 56.1 C73.8 60.3 85.3 66.9 85.3 66.9 Z"
    />
    <path
      className={styles.shelfPot}
      d="M99.5 63.3 H73.9 V83.1 C73.9 84.5 75 85.6 76.4 85.6 H97 C98.4 85.6 99.5 84.5 99.5 83.1 Z"
    />
  </Sticker>
);

export default ShelfSticker;
