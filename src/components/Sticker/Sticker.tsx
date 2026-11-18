import type { ReactNode } from 'react';

import * as styles from './Sticker.css';

type StickerProps = { children: ReactNode };

/**
 * Shows the frame of an empty-state drawing: 120 × 100, with round line ends. The drawing is decorative.
 */
const Sticker = ({ children }: StickerProps) => (
  <svg
    className={styles.sticker}
    viewBox="0 0 120 100"
    aria-hidden="true"
    focusable="false"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export default Sticker;
