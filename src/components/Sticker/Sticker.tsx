import type { ReactNode } from 'react';

import * as styles from './Sticker.css';

type StickerProps = { children: ReactNode };

// the frame every empty-state drawing shares: 120×100, outlines with round ends, decorative
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
