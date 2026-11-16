import type { Meta, StoryObj } from '@storybook/react-vite';

import { BOOKS, COUNTRY_NAMES } from '../../../.storybook/fixtures';
import { withRouter } from '../../../.storybook/withRouter';
import BookRow from './BookRow';

// a row of the reader's books; its Edit link needs a router, and it sits in a list
const meta = {
  title: 'Components/BookRow',
  component: BookRow,
  args: { book: BOOKS[0], names: COUNTRY_NAMES },
  decorators: [
    (Story) => (
      <ul>
        <Story />
      </ul>
    ),
    withRouter,
  ],
} satisfies Meta<typeof BookRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SetAndAuthor: Story = {};

export const SetElsewhere: Story = { args: { book: BOOKS[2] } };

export const ImaginedWorld: Story = { args: { book: BOOKS[3] } };

export const NoPlaces: Story = {
  args: { book: { ...BOOKS[1], places: [], author: null } },
};
