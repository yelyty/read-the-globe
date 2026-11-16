import type { Meta, StoryObj } from '@storybook/react-vite';

import { withRouter } from '../../../.storybook/withRouter';
import ButtonLink from './ButtonLink';

// a router Link dressed as a Button; the stories give it a router of its own
const meta = {
  title: 'Components/Button/ButtonLink',
  component: ButtonLink,
  decorators: [withRouter],
} satisfies Meta<typeof ButtonLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => <ButtonLink to="/">Start your atlas</ButtonLink>,
};

export const Link: Story = {
  render: () => (
    <ButtonLink to="/" variant="link">
      Back home
    </ButtonLink>
  ),
};
