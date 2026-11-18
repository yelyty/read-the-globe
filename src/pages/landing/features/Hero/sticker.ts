import type { CSSProperties } from 'react';

/**
 * Gets the style of a sticker from its CSS variables: its center (--x, --y), size (--s), tilt (--r), and delay (--n).
 */
export const sticker = (props: Record<string, string>) =>
  props as CSSProperties;
