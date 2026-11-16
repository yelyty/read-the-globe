import type { Meta, StoryObj } from '@storybook/react-vite';

import StatusLine from './StatusLine';

// the line beside a form's button that says what just happened
const meta = {
  title: 'Components/StatusLine',
  component: StatusLine,
  args: { children: 'Saved “Things Fall Apart” for later.' },
} satisfies Meta<typeof StatusLine>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
