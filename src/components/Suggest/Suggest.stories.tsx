import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { COUNTRY_NAMES } from '../../../.storybook/fixtures';
import Field from '../Field/Field';
import Suggest from './Suggest';

const COUNTRIES = Object.values(COUNTRY_NAMES);

// a text field with its own suggestion menu; type, or use the arrow keys
const meta = {
  title: 'Components/Suggest',
  component: Suggest,
  args: {
    value: '',
    options: COUNTRIES,
    onValue: fn(),
    onPick: fn(),
    'aria-label': 'Country',
    placeholder: 'Start typing a country',
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleValue = (value: string) => {
      args.onValue(value);
      updateArgs({ value });
    };

    return <Suggest {...args} onValue={handleValue} />;
  },
} satisfies Meta<typeof Suggest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Typed: Story = { args: { value: 'Ja' } };

// nothing to suggest: a plain text field
export const NoOptions: Story = { args: { options: [] } };

// inside a Field it takes the field's id, label and error
export const InField: Story = {
  args: { 'aria-label': undefined },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleValue = (value: string) => {
      args.onValue(value);
      updateArgs({ value });
    };

    return (
      <Field
        id="suggest-country"
        label="Where the author is from"
        control={<Suggest {...args} onValue={handleValue} />}
      />
    );
  },
};
