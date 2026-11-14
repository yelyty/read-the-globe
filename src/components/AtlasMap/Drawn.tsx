import { useEffect } from 'react';

// mounted inside the map once its countries are drawn, so the phone frame can measure them
export const Drawn = ({ onDrawn }: { onDrawn: () => void }) => {
  useEffect(onDrawn, [onDrawn]);

  return null;
};
