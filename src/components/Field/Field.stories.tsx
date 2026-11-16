import type { Meta, StoryObj } from '@storybook/react-vite';

import Hint from '../Hint/Hint';
import Field from './Field';
import FieldTextarea from './FieldTextarea';

const meta = {
  title: 'Components/Field',
  component: Field,
  args: {
    id: 'field',
    label: 'Title',
    placeholder: 'One Hundred Years of Solitude',
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: 'Give the book a title.' },
};

export const WithHint: Story = {
  args: {
    label: 'Places',
    placeholder: 'Paris, Lyon',
    'aria-describedby': 'field-hint',
    below: <Hint id="field-hint">Separate places with a comma.</Hint>,
  },
};

export const Password: Story = {
  args: { label: 'Password', password: true, placeholder: undefined },
};

export const Compact: Story = { args: { compact: true } };

// another control in the input's place: it takes the field's id and aria props
export const Textarea: Story = {
  args: {
    label: 'Message',
    control: <FieldTextarea rows={4} />,
  },
};
