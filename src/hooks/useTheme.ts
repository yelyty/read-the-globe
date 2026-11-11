import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

// index.html's head script always sets data-theme (saved choice, else the system's), so it is the one source of truth
const read = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
  });

  return () => observer.disconnect();
};

/** The page's current reading mode, kept in step with data-theme on <html>. */
export const useTheme = () => useSyncExternalStore(subscribe, read);
