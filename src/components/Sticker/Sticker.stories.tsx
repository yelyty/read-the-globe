import type { Meta, StoryObj } from '@storybook/react-vite';

import GoalsSticker from './GoalsSticker';
import NextReadSticker from './NextReadSticker';
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

export const Goals: Story = { render: () => <GoalsSticker /> };

export const NextRead: Story = { render: () => <NextReadSticker /> };

export const Shelf: Story = { render: () => <ShelfSticker /> };
