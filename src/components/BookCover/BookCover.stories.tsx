import type { Meta, StoryObj } from '@storybook/react-vite';

import { BOOKS } from '../../../.storybook/fixtures';
import BookCover from './BookCover';

const meta = {
  title: 'Components/BookCover',
  component: BookCover,
  args: {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
  },
  argTypes: { size: { control: 'inline-radio', options: ['row', 'small'] } },
} satisfies Meta<typeof BookCover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Row: Story = {};

export const Small: Story = { args: { size: 'small' } };

// each book wears its own cloth, picked from its title and author
export const Shelf: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
      {BOOKS.map((book) => (
        <BookCover
          key={book.id}
          title={book.title}
          author={book.author?.name}
        />
      ))}
      {BOOKS.map((book) => (
        <BookCover
          key={`small-${book.id}`}
          title={book.title}
          author={book.author?.name}
          size="small"
        />
      ))}
    </div>
  ),
};
