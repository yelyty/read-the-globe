import { useEffect, useState } from 'react';

// the map full screen: Escape closes it, and the page behind doesn't scroll
export function useFullScreen() {
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
}
