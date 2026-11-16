import type { Meta, StoryObj } from '@storybook/react-vite';

import Logo from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  decorators: [
    (Story) => (
      <div style={{ width: 160 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
