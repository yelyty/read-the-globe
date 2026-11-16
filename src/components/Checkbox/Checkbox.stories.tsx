import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import Checkbox from './Checkbox';

// it goes inside the <label> that names it
const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { id: 'checkbox', onChange: fn() },
  render: (args) => (
    <label htmlFor={args.id}>
      <Checkbox {...args} /> Counts toward my goal
    </label>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};
