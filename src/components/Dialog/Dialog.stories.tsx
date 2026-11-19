import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import Button from '../Button/Button';
import Dialog from './Dialog';
import DialogActions from './DialogActions';
import DialogText from './DialogText';

// the parent owns `open`: here the story's args do, so ×, Esc and the backdrop close it and the button opens it again
const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    open: false,
    onClose: fn(),
    title: 'Clear your atlas?',
    children: (
      <>
        <DialogText>
          Every book, place and goal goes. Your account stays.
        </DialogText>
        <DialogActions>
          <Button variant="neutral">Keep it</Button>
          <Button variant="danger">Clear atlas</Button>
        </DialogActions>
      </>
    ),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'sheet'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleOpen = () => updateArgs({ open: true });

    const handleClose = () => {
      args.onClose();
      updateArgs({ open: false });
    };

    return (
      <>
        <Button variant="primary" onClick={handleOpen}>
          Open dialog
        </Button>
        <Dialog {...args} onClose={handleClose} />
      </>
    );
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSub: Story = {
  args: {
    title: 'Restore a backup',
    sub: <DialogText>Your atlas as it was on 3 March 2026.</DialogText>,
  },
};

export const Sheet: Story = {
  args: {
    variant: 'sheet',
    title: 'Log a book',
    children: <DialogText>A wider dialog, for forms.</DialogText>,
  },
};

// Esc and the backdrop ask before closing; × still closes at once
export const Dirty: Story = { args: { dirty: true } };
