import type { Meta, StoryObj } from '@storybook/react-vite';

import HatchPattern from './HatchPattern';
import { HATCH_MAP, HATCH_STAMP } from './hatchSize';

// a country with both marks; it goes inside an SVG's <defs>, so the story fills a square with it
const meta = {
  title: 'Components/HatchPattern',
  component: HatchPattern,
  args: { id: 'story-hatch', size: HATCH_MAP },
  render: (args) => (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <HatchPattern {...args} />
      </defs>
      <rect width="120" height="120" fill={`url(#${args.id})`} />
    </svg>
  ),
} satisfies Meta<typeof HatchPattern>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OnTheMap: Story = {};

export const OnAStamp: Story = { args: { size: HATCH_STAMP } };
