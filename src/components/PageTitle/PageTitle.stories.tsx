import type { Meta, StoryObj } from '@storybook/react-vite';

import PageTitle from './PageTitle';

const meta = {
  title: 'Components/PageTitle',
  component: PageTitle,
  args: { children: 'Your shelf' },
} satisfies Meta<typeof PageTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
