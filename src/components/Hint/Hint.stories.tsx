import type { Meta, StoryObj } from '@storybook/react-vite';

import Hint from './Hint';

const meta = {
  title: 'Components/Hint',
  component: Hint,
  args: { children: 'The country the story is set in, or one of them.' },
} satisfies Meta<typeof Hint>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMarkup: Story = {
  args: {
    children: (
      <>
        Separate places with a comma: <em>Paris, Lyon</em>
      </>
    ),
  },
};
