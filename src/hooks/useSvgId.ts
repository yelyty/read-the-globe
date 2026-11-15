import { useId } from 'react';

// a unique id an SVG url(#…) can point at: useId gives «r0»-style ids, url() wants plain letters
export const useSvgId = (prefix: string) =>
  `${prefix}-${useId().replace(/[^\w-]/g, '')}`;
