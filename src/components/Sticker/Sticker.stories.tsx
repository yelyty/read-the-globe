import type { Meta, StoryObj } from '@storybook/react-vite';

import HilltopSticker from './HilltopSticker';
import RibbonSticker from './RibbonSticker';
import ShelfSticker from './ShelfSticker';
import Sticker from './Sticker';

// the empty states' drawings, each in the shared Sticker frame
const meta = {
  title: 'Components/Sticker',
  component: Sticker,
  // each story draws its own sticker in place of the frame's children
  args: { children: null },
} satisfies Meta<typeof Sticker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Hilltop: Story = { render: () => <HilltopSticker /> };

export const Ribbon: Story = { render: () => <RibbonSticker /> };

export const Shelf: Story = { render: () => <ShelfSticker /> };
