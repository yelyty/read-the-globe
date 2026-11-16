import type { Meta, StoryObj } from '@storybook/react-vite';

import ThemeButton from './ThemeButton';

// flips the page between day and night, as the toolbar's Theme does
const meta = {
  title: 'Components/ThemeButton',
  component: ThemeButton,
} satisfies Meta<typeof ThemeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
