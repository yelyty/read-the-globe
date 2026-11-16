import type { Decorator } from '@storybook/react-vite';
import { IconContext } from '@phosphor-icons/react';

import { overwriteGetLocale, type Locale } from '../src/paraglide/runtime.js';

const ICONS = { weight: 'bold' } as const;

/** every story as the app has it: the toolbar's theme on <html>, its language for the messages, bold icons */
export const withAppShell: Decorator = (Story, { globals }) => {
  const theme = globals.theme === 'dark' ? 'dark' : 'light';
  const locale = (globals.locale ?? 'en') as Locale;

  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = locale;
  overwriteGetLocale(() => locale);

  return (
    <IconContext.Provider value={ICONS}>
      <Story />
    </IconContext.Provider>
  );
};
