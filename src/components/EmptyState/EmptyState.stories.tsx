import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button/Button';
import HilltopSticker from '../Sticker/HilltopSticker';
import ShelfSticker from '../Sticker/ShelfSticker';
import EmptyState from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: {
    art: <ShelfSticker />,
    title: 'Your shelf is empty',
    text: 'Log the first book you read, and it starts here.',
    actions: <Button variant="primary">Log a book</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNote: Story = {
  args: {
    art: <HilltopSticker />,
    title: 'No goals yet',
    text: 'Pick a part of the world to read your way across.',
    actions: <Button variant="primary">Set a goal</Button>,
    note: 'You can change or remove a goal at any time.',
  },
};

export const TextOnly: Story = {
  args: {
    art: undefined,
    title: undefined,
    actions: undefined,
    text: 'Nothing to read next yet.',
  },
};
