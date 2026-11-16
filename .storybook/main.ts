import type { StorybookConfig } from '@storybook/react-vite';

// Stories for the presentational components only (src/components); the app's own vite.config.ts is reused,
// so vanilla-extract and Paraglide work as in the app
const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  // the world map file (countries-50m.json) the atlas draws from
  staticDirs: ['../public'],
};

export default config;
