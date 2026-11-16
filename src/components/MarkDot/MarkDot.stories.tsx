import type { Meta, StoryObj } from '@storybook/react-vite';

import MarkDot from './MarkDot';

// a country's mark as a dot beside its words
const meta = {
  title: 'Components/MarkDot',
  component: MarkDot,
  args: { kind: 'set' },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['set', 'author', 'both', 'imagined'],
    },
  },
} satisfies Meta<typeof MarkDot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SetIn: Story = {};

export const Author: Story = { args: { kind: 'author' } };

export const Both: Story = { args: { kind: 'both' } };

export const Imagined: Story = { args: { kind: 'imagined' } };
