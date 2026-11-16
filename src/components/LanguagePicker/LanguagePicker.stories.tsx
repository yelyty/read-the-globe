import type { Meta, StoryObj } from '@storybook/react-vite';

import LanguagePicker from './LanguagePicker';

// each language in its own name; picking one reloads the page in it (use the toolbar's Language here instead)
const meta = {
  title: 'Components/LanguagePicker',
  component: LanguagePicker,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['compact', 'field', 'footer'],
    },
  },
} satisfies Meta<typeof LanguagePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Compact: Story = {};

export const Field: Story = { args: { variant: 'field', label: 'Language' } };

export const Footer: Story = { args: { variant: 'footer' } };
