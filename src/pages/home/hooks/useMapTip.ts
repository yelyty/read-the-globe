import { useCallback, useEffect, useState } from 'react';

import type { Tip } from '../components/MapTip';

/**
 * Keeps the tip of the map: it shows over a country after a mouse move, a tap, or keyboard focus.
 * It closes on Escape, or on a press anywhere outside the map and the country list.
 */
export const useMapTip = () => {
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    if (!tip) return;

    const away = (dismissEvent: Event) =>
      (dismissEvent instanceof KeyboardEvent
        ? dismissEvent.key === 'Escape'
        : !(dismissEvent.target as Element).closest('[data-tips]')) &&
      setTip(null);

    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', away);

    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', away);
    };
  }, [tip]);

  // the tip over an element: a country's shape, or its chip in the list
  const tipAt = useCallback((code: string, el: Element, by: Tip['by']) => {
    const rect = el.getBoundingClientRect();

    setTip({
      code,
      x: rect.left + rect.width / 2,
      y: rect.top,
      bottom: rect.bottom,
      by,
    });
  }, []);

  // a country chip reached from the keyboard shows the map's tip for it; leaving the chips hides it
  const focusCountry = useCallback(
    (code: string, el: Element | null) =>
      el ? tipAt(code, el, 'key') : setTip(null),
    [tipAt]
  );

  return { tip, setTip, tipAt, focusCountry };
};
