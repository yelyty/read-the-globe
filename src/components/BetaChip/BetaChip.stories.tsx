import type { Meta, StoryObj } from '@storybook/react-vite';

import Logo from '../Logo/Logo';
import BetaChip from './BetaChip';

const meta = {
  title: 'Components/BetaChip',
  component: BetaChip,
} satisfies Meta<typeof BetaChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// as the headers show it: beside the wordmark
export const BesideTheLogo: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 40, height: 40 }}>
        <Logo />
      </div>
      <span style={{ fontSize: 23 }}>Read The Globe</span>
      <BetaChip />
    </div>
  ),
};
