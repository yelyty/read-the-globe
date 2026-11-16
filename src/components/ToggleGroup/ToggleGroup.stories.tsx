import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import ToggleGroup from './ToggleGroup';

// one of a few, applied at once: the story's args hold which one is pressed
const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  args: {
    value: 'all',
    label: 'Show on the map',
    onChange: fn(),
    options: [
      { value: 'all', content: 'All marks' },
      { value: 'set', content: 'Set in' },
      { value: 'author', content: 'Authors from' },
    ],
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleChange = (value: string | number) => {
      args.onChange(value);
      updateArgs({ value });
    };

    return <ToggleGroup {...args} onChange={handleChange} />;
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// buttons that aren't words carry their name in ariaLabel
export const Swatches: Story = {
  args: {
    value: 'cream',
    label: 'Paper',
    options: [
      {
        value: 'cream',
        content: '',
        ariaLabel: 'Cream',
        style: { background: '#F6EFDF', width: 32, height: 32 },
      },
      {
        value: 'sage',
        content: '',
        ariaLabel: 'Sage',
        style: { background: '#D9E2CF', width: 32, height: 32 },
      },
      {
        value: 'ink',
        content: '',
        ariaLabel: 'Ink',
        style: { background: '#2B2A26', width: 32, height: 32 },
      },
    ],
  },
};
