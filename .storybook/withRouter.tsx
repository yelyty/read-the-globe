import type { Decorator } from '@storybook/react-vite';

import StoryRouter from './StoryRouter';

/** for components with a router Link (ButtonLink, BookRow) */
export const withRouter: Decorator = (Story) => <StoryRouter story={Story} />;
