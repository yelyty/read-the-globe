import { useEffect, useState } from 'react';

import { SECTIONS } from '../../sections';

// the section on screen: the one crossing a thin line just under the middle of the viewport
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
