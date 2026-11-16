import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import Select from './Select';

const SORTS = [
  { value: 'recent', label: 'Recently read' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'country', label: 'Country' },
];

// controlled: the story's args hold the value, so picking an option shows it
const meta = {
  title: 'Components/Select',
  component: Select,
  args: { value: 'recent', options: SORTS, onChange: fn(), label: 'Sort by' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['field', 'compact', 'pill', 'footer'],
    },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleChange = (value: string) => {
      args.onChange(value);
      updateArgs({ value });
    };

    return <Select {...args} onChange={handleChange} />;
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Field: Story = {};

export const Compact: Story = { args: { variant: 'compact' } };

export const Pill: Story = { args: { variant: 'pill' } };

export const Footer: Story = { args: { variant: 'footer' } };

export const Disabled: Story = { args: { disabled: true } };

// a language's name is written in its own language
export const Languages: Story = {
  args: {
    value: 'en',
    label: 'Language',
    options: [
      { value: 'en', label: 'English', lang: 'en' },
      { value: 'cs', label: 'Čeština', lang: 'cs' },
      { value: 'uk', label: 'Українська', lang: 'uk' },
    ],
  },
};
