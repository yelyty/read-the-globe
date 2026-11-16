import { createElement, type RefObject } from 'react';
import { BookmarkSimpleIcon } from '@phosphor-icons/react';

import type { NextRead } from '../../../../types';
import {
  addNextRead,
  removeNextRead,
} from '../../../../api/nextReads/nextReads';
import { useStatus } from '../../../../hooks/useStatus';
import { useUndo } from '../../../../hooks/useUndo';
import { m } from '../../../../paraglide/messages.js';

type NextReadActions = {
  items: NextRead[];
  setItems: (update: (items: NextRead[]) => NextRead[]) => void;
  /** the form's title field: focus goes back to it after a removal */
  titleRef: RefObject<HTMLInputElement | null>;
};

/** Saving, removing and pointing out next reads. The list is this card's own: each change updates it in place,
    without reloading the Shelf. */
export function useNextReadActions({
  items,
  setItems,
  titleRef,
}: NextReadActions) {
  const status = useStatus();
  const offerUndo = useUndo();

  const add = async (draft: Parameters<typeof addNextRead>[0]) => {
    const saved = await addNextRead(draft);

    if (saved.problem === null) setItems((list) => [saved.data, ...list]);

    return saved;
  };

  // already on the list: say so, with a button to its row
  const showDuplicate = (dup: NextRead) =>
    status.show({
      text: m.next_dup({ title: dup.title }),
      action: {
        label: m.next_see_it(),
        icon: createElement(BookmarkSimpleIcon, { 'aria-hidden': true }),
        run: () => {
          const row = document.getElementById(`next-${dup.id}`);

          row?.scrollIntoView({ block: 'center' });
          row?.focus({ preventScroll: true });
        },
      },
    });

  const remove = async (item: NextRead) => {
    const problem = await removeNextRead(item);

    if (problem) {
      status.show({ text: problem });

      return;
    }

    const at = items.indexOf(item);

    setItems((list) => list.filter((it) => it.id !== item.id));

    // Undo puts the item back where it was
    offerUndo({
      said: m.next_removed({ title: item.title }),
      undo: async () => {
        const back = await addNextRead(item);

        if (back.problem !== null) return back.problem;

        setItems((list) => [
          ...list.slice(0, at),
          back.data,
          ...list.slice(at),
        ]);

        return null;
      },
      refresh: false,
    });

    titleRef.current?.focus();
  };

  return { add, remove, showDuplicate };
}
