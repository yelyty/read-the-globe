import { useEffect, useRef } from 'react';

import { updateProfile } from '../../../../api/profile/profile';
import type { CardOptions } from '../../utils/cardOptions';

// the set-up is saved once the reader stops changing it for this long
const SAVE_DELAY_MS = 600;

/**
 * Saves the set-up of the card in the profile of the reader.
 * The save occurs 600 ms after the last change. This delay prevents a save for each small change.
 * @param options - The current set-up of the card.
 * @param userId - The ID of the reader. If there is no ID, the hook does not save.
 */
export const useSavedSetup = (options: CardOptions, userId?: string) => {
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
};
