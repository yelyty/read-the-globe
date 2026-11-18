import { useId } from 'react';

/**
 * Gets a unique id that an SVG url(#…) can point at. The id has only letters, digits, and dashes.
 * @param prefix - The start of the id, for example "hatch".
 */
export const useSvgId = (prefix: string) =>
  `${prefix}-${useId().replace(/[^\w-]/g, '')}`;
