import { useState } from 'react';
import { useBlocker } from '@tanstack/react-router';
import { m } from '../paraglide/messages.js';

// ponytail: the browser's own confirm; swap in a styled dialog if it ever jars
const keepChanges = () => !confirm(m.common_discard());

/** true once `state` differs from what it was on the first render */
export const useDirty = (state: unknown) => {
  const now = JSON.stringify(state);
  const [first] = useState(now);

  return now !== first;
};

/** Esc or a click on the scrim: the dialog closes, unless it holds changes the reader wants to keep.
    Cancel, × and Close still close at once: those are a choice, not a slip. */
export const dismiss = (dialog: HTMLDialogElement | null, dirty: boolean) => {
  if (!dirty || !keepChanges()) dialog?.close();
};

/** a page form: leaving the page or closing the tab asks first while it holds unsaved typing */
export const useLeaveGuard = (dirty: boolean) =>
  useBlocker({
    shouldBlockFn: keepChanges,
    enableBeforeUnload: dirty,
    disabled: !dirty,
  });
