import { useEffect } from 'react';

/**
 * Tells the map that its countries are drawn. The map puts it inside after the countries, so on a phone it can measure them.
 */
export const Drawn = ({ onDrawn }: { onDrawn: () => void }) => {
  useEffect(onDrawn, [onDrawn]);

  return null;
};
