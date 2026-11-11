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
import * as styles from '../DeleteAccount/DeleteAccount.css';
import { m } from '../../../../paraglide/messages.js';

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
    const problem = was ? await clearAtlas() : m.account_clear_failed();

    setClearing(false);
    close();

    if (problem || !was) {
      status.show({ text: problem ?? '' });

      return;
    }

    await router.invalidate();
    await router.navigate({ to: '/app' });

    status.show({
      text: m.account_cleared({ what: lost }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          // anything logged since the clear stays, beside the atlas as it was
          const since = await getBackup(userId).catch(() => null);

          const taken = new Set(
            was.goals.map((goal) => goal.name.toLowerCase())
          );

          const problem = since
            ? await restoreBackup({
                ...was,
                books: [...since.books, ...was.books],
                goals: [
                  ...was.goals,
                  ...since.goals.filter(
                    (goal) => !taken.has(goal.name.toLowerCase())
                  ),
                ],
                nextReads: [
                  ...(since.nextReads ?? []),
                  ...(was.nextReads ?? []),
                ],
                worlds: [...(was.worlds ?? []), ...(since.worlds ?? [])],
              })
            : m.data_restore_failed();

          if (problem) return status.show({ text: problem });
          await router.invalidate();
          status.show({ text: m.account_atlas_back() });
        },
      },
    });
  };

  return (
    <div className={styles.dangerItem}>
      <h3 className={styles.itemTitle}>{m.account_clear()}</h3>
      <p className={styles.itemText} id="ac-clear-desc">
        {blank ? m.account_clear_blank() : m.account_clear_text()}
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
        {m.account_clear()}
      </Button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="ac-clear-title"
        aria-describedby="ac-clear-q"
        onClose={() => setRound((current) => current + 1)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={styles.dialogHead}>
          <h2 className={styles.dialogTitle} id="ac-clear-title">
            {m.account_clear_question()}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={m.common_close()}
            onClick={close}
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>
        <p className={styles.dialogText} id="ac-clear-q">
          {m.account_clear_dialog({ what: lost })}
        </p>
        <KeepCopy key={round} books={books} names={names} />
        <div className={styles.dialogActions}>
          <Button
            id="ac-clear-keep"
            type="button"
            variant="text"
            onClick={close}
          >
            {m.account_keep_atlas()}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={clearing}
            onClick={clear}
          >
            <EraserIcon aria-hidden="true" />
            {m.account_clear()}
          </Button>
        </div>
      </dialog>
    </div>
  );
};

export default ClearAtlas;
