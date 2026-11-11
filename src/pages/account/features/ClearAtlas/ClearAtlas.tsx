import { useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  ArrowCounterClockwiseIcon,
  EraserIcon,
  XIcon,
} from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import {
  clearAtlas,
  getBackup,
  restoreBackup,
} from '../../../../api/data/data';
import { useStatus } from '../../../../hooks/useStatus';
import { Button } from '../../../../components/Button/Button';
import { atlasWords } from '../YourData/readingList';
import KeepCopy from '../DeleteAccount/KeepCopy';
import * as s from '../DeleteAccount/DeleteAccount.css';

type ClearAtlasProps = {
  userId: string;
  books: BookEntry[];
  goals: Goal[];
  names: Record<string, string>;
};

// Clear this atlas: books, goals, next reads and saved worlds go; the account stays. Undo puts them back.
const ClearAtlas = ({ userId, books, goals, names }: ClearAtlasProps) => {
  const router = useRouter();
  const status = useStatus();
  const dialog = useRef<HTMLDialogElement>(null);
  const [round, setRound] = useState(0);
  const [clearing, setClearing] = useState(false);

  // nothing to clear on a blank atlas: the button says so rather than opening an empty dialog
  const blank = !books.length && !goals.length;
  const lost = atlasWords(books.length, goals.length);

  const open = () => {
    dialog.current?.showModal();
    document.getElementById('ac-clear-keep')?.focus(); // the safe choice takes focus
  };
  const close = () => dialog.current?.close();

  const clear = async () => {
    setClearing(true);
    // the snapshot Undo restores, taken first: if it can't be read, nothing is cleared
    const was = await getBackup(userId).catch(() => null);
    const problem = was
      ? await clearAtlas()
      : 'Your atlas couldn’t be cleared. Try again.';
    setClearing(false);
    close();
    if (problem || !was) {
      status.show({ text: problem ?? '' });
      return;
    }
    await router.invalidate();
    await router.navigate({ to: '/app' });
    status.show({
      text: `Cleared ${lost}.`,
      action: {
        label: 'Undo',
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          // anything logged since the clear stays, beside the atlas as it was
          const since = await getBackup(userId).catch(() => null);
          const taken = new Set(was.goals.map((g) => g.name.toLowerCase()));
          const problem = since
            ? await restoreBackup({
                ...was,
                books: [...since.books, ...was.books],
                goals: [
                  ...was.goals,
                  ...since.goals.filter(
                    (g) => !taken.has(g.name.toLowerCase())
                  ),
                ],
                nextReads: [
                  ...(since.nextReads ?? []),
                  ...(was.nextReads ?? []),
                ],
                worlds: [...(was.worlds ?? []), ...(since.worlds ?? [])],
              })
            : 'That backup couldn’t be restored. Your atlas is unchanged.';
          if (problem) return status.show({ text: problem });
          await router.invalidate();
          status.show({ text: 'Your atlas is back.' });
        },
      },
    });
  };

  return (
    <div className={s.dangerItem}>
      <h3 className={s.itemTitle}>Clear this atlas</h3>
      <p className={s.itemText} id="ac-clear-desc">
        {blank
          ? 'Your atlas is already blank, so there is nothing to clear yet.'
          : 'Removes every pinned book and goal. Your account stays.'}
      </p>
      <Button
        type="button"
        variant="dangerOutline"
        aria-haspopup="dialog"
        aria-describedby="ac-clear-desc"
        disabled={blank}
        onClick={open}
      >
        <EraserIcon aria-hidden="true" />
        Clear this atlas
      </Button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={s.dialog}
        aria-labelledby="ac-clear-title"
        aria-describedby="ac-clear-q"
        onClose={() => setRound((r) => r + 1)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={s.dialogHead}>
          <h2 className={s.dialogTitle} id="ac-clear-title">
            Clear this atlas?
          </h2>
          <button
            type="button"
            className={s.close}
            aria-label="Close"
            onClick={close}
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>
        <p className={s.dialogText} id="ac-clear-q">
          {`This removes ${lost} from your atlas. You can undo it for a few seconds afterwards.`}
        </p>
        <KeepCopy key={round} books={books} names={names} />
        <div className={s.dialogActions}>
          <Button
            id="ac-clear-keep"
            type="button"
            variant="text"
            onClick={close}
          >
            Keep this atlas
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={clearing}
            onClick={clear}
          >
            <EraserIcon aria-hidden="true" />
            Clear this atlas
          </Button>
        </div>
      </dialog>
    </div>
  );
};

export default ClearAtlas;
