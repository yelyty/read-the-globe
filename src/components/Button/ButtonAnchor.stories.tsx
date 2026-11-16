import type { Meta, StoryObj } from '@storybook/react-vite';

import ButtonAnchor from './ButtonAnchor';

const meta = {
  title: 'Components/Button/ButtonAnchor',
  component: ButtonAnchor,
  args: { children: 'Read the journal', href: '#' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'secondary', 'link', 'quiet'],
    },
  },
} satisfies Meta<typeof ButtonAnchor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Link: Story = { args: { variant: 'link' } };
