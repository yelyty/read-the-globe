import { useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react';

import { m } from '../paraglide/messages.js';
import { useStatus, type Status } from './useStatus';

/** a change the reader can take back from the status line */
export type UndoableChange = {
  /** what was done, in words: the status line */
  said: string;
  /** puts it back; returns what went wrong, or null */
  undo: () => Promise<string | null>;
  /** said once it's back; nothing is said when it's left out */
  undone?: string;
  /** reload the page's data once it's back; false when the caller puts its own list back */
  refresh?: boolean;
};

type Outlets = {
  show: (status: Status) => void;
  refresh: () => Promise<unknown>;
};

/** Says what was done, with Undo beside it. Undo puts it back, refreshes, and says so; or says what went wrong. */
export const offerUndo = (
  { said, undo, undone, refresh = true }: UndoableChange,
  outlets: Outlets
) =>
  outlets.show({
    text: said,
    action: {
      label: m.common_undo(),
      icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
      run: async () => {
        const problem = await undo();

        if (problem) return outlets.show({ text: problem });
        if (refresh) await outlets.refresh();
        if (undone) outlets.show({ text: undone });
      },
    },
  });

/** offerUndo, wired to the status line and the router */
export function useUndo() {
  const { show } = useStatus();
  const router = useRouter();

  return useCallback(
    (change: UndoableChange) =>
      offerUndo(change, { show, refresh: () => router.invalidate() }),
    [show, router]
  );
}
