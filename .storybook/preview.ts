import type { Preview } from '@storybook/react-vite';

import { locales } from '../src/paraglide/runtime.js';
import '../src/styles/global.css.ts';
import '../src/styles/index.css';
import '../src/styles/theme.css.ts';
import { withAppShell } from './withAppShell';

const preview: Preview = {
  decorators: [withAppShell],
  globalTypes: {
    theme: {
      description: 'Day or night reading mode',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Day', icon: 'sun' },
          { value: 'dark', title: 'Night', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'The language the messages are in',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: locales.map((locale) => ({ value: locale, title: locale })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', locale: 'en' },
  parameters: {
    // the app paints its own page colour from the theme
    backgrounds: { disabled: true },
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: 'error' },
  },
};

export default preview;
