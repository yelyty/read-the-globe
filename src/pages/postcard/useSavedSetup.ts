import { useEffect, useRef } from 'react';

import { updateProfile } from '../../api/Profile/updateProfile';
import type { CardOptions } from './cardOptions';

// the set-up is saved once the reader stops changing it for this long
const SAVE_DELAY_MS = 600;

// the card's set-up saves with the reader's profile, a moment after the last change
export function useSavedSetup(options: CardOptions, userId?: string) {
  const savedJson = useRef(JSON.stringify(options));

  useEffect(() => {
    const json = JSON.stringify(options);

    if (json === savedJson.current || !userId) return;

    const timer = setTimeout(() => {
      savedJson.current = json;

      updateProfile(userId, { postcard: options }).then(
        (problem) => problem && console.error(problem)
      );
    }, SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [options, userId]);
}
