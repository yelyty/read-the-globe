import { useEffect, useState } from 'react';

import { SECTIONS } from '../../utils/sections';

/**
 * Gets the section of the landing that is on screen: the one that crosses a thin line just under the middle of the screen.
 * @returns The hash of the section, or null.
 */
export const useCurrentSection = () => {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const sections = SECTIONS.map(({ hash }) =>
      document.getElementById(hash)
    ).filter((el) => el !== null);

    if (!sections.length) return;
    const seen = new Map<Element, boolean>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          seen.set(entry.target, entry.isIntersecting)
        );

        setCurrent(sections.filter((el) => seen.get(el)).pop()?.id ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return current;
};
