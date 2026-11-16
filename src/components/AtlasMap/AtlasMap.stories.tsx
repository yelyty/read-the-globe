import type { Meta, StoryObj } from '@storybook/react-vite';

import { BOOKS } from '../../../.storybook/fixtures';
import { atlasMarks } from '../../utils/atlasMarks';
import AtlasMap from './AtlasMap';

// the reader's atlas: olive where stories are set, rust where authors are from, stripes for both
const meta = {
  title: 'Components/AtlasMap',
  component: AtlasMap,
  args: {
    marks: atlasMarks(BOOKS),
    dots: [],
    caption: 'Your atlas: 5 countries marked',
  },
  argTypes: {
    show: { control: 'inline-radio', options: ['all', 'set', 'author'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AtlasMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllMarks: Story = {};

export const SetInOnly: Story = { args: { show: 'set' } };

export const AuthorsOnly: Story = { args: { show: 'author' } };

// Home: unmarked countries lift under the pointer, inviting a book set there
export const Open: Story = { args: { open: true } };

export const Empty: Story = {
  args: { marks: {}, caption: 'Your atlas: nothing marked yet' },
};
