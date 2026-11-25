import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Log a book', onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'contained',
        'primary',
        'neutral',
        'secondary',
        'text',
        'link',
        'quiet',
        'danger',
        'dangerOutline',
      ],
    },
    underline: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Contained: Story = {};

export const Primary: Story = { args: { variant: 'primary' } };

export const Neutral: Story = { args: { variant: 'neutral' } };

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Text: Story = { args: { variant: 'text' } };

export const Link: Story = { args: { variant: 'link', children: 'See all' } };

export const UnderlinedLink: Story = {
  args: { variant: 'link', underline: true, children: 'privacy notice' },
};

export const Quiet: Story = { args: { variant: 'quiet', children: 'Undo' } };

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete account' },
};

export const DangerOutline: Story = {
  args: { variant: 'dangerOutline', children: 'Clear atlas' },
};

// primary and neutral show a busy cursor while disabled: a save in progress
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };
