import type { CSSProperties } from 'react';

// each sticker is placed by its centre (--x, --y), sized (--s), tilted (--r) and staggered (--n)
export const sticker = (props: Record<string, string>) =>
  props as CSSProperties;
