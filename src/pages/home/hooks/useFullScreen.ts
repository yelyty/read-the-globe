import { useEffect, useState } from 'react';

/**
 * Shows the map full screen. Escape closes it, and the page behind does not scroll.
 * @returns If the map is full screen, and the function that sets it.
 */
export const useFullScreen = () => {
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!full) return;

    const close = (keyEvent: KeyboardEvent) =>
      keyEvent.key === 'Escape' && setFull(false);

    document.addEventListener('keydown', close);
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', close);
      document.documentElement.style.overflow = '';
    };
  }, [full]);

  return [full, setFull] as const;
};
