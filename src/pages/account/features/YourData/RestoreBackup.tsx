import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  ArrowCounterClockwiseIcon,
  UploadSimpleIcon,
  XIcon,
} from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../types';
import {
  getBackup,
  restoreBackup,
  type Backup,
} from '../../../../api/data/data';
import { useStatus } from '../../../../hooks/useStatus';
import { Button } from '../../../../components/Button/Button';
import { button } from '../../../../components/Button/Button.css';
import * as s from '../DeleteAccount/DeleteAccount.css';
import { atlasWords, bookCount, goalCount } from './readingList';

type RestoreBackupProps = {
  userId: string;
  books: BookEntry[];
  goals: Goal[];
  /** a file that isn't a backup, in words */
  onFail: (text: string) => void;
};

const NOT_A_BACKUP =
  'That file isn’t a Read The Globe backup. Choose a .json file made with Full backup.';

// Restore a backup (JSON): it replaces the atlas after a confirmation, and Undo puts the atlas back as it was
const RestoreBackup = ({
  userId,
  books,
  goals,
  onFail,
}: RestoreBackupProps) => {
  const router = useRouter();
  const status = useStatus();
  const file = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const [restoring, setRestoring] = useState(false);

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0];
    event.target.value = '';
    if (!chosen) return;
    let data: Partial<Backup> | null = null;
    try {
      data = JSON.parse(await chosen.text()) as Partial<Backup>;
    } catch {
      // not JSON: said below
    }
    if (!data || !Array.isArray(data.books) || !Array.isArray(data.goals)) {
      onFail(NOT_A_BACKUP);
      return;
    }
    setPending(data as Backup);
    dialog.current?.showModal();
    document.getElementById('ac-restore-keep')?.focus(); // the safe choice takes focus
  };

  const close = () => dialog.current?.close();

  const restore = async () => {
    if (!pending) return;
    setRestoring(true);
    // the atlas as it is now, exported first so Undo can restore it
    const was = await getBackup(userId).catch(() => null);
    const problem = was
      ? await restoreBackup(pending)
      : 'That backup couldn’t be restored. Your atlas is unchanged.';
    setRestoring(false);
    close();
    if (problem || !was) {
      status.show({ text: problem ?? '' });
      return;
    }
    await router.invalidate();
    status.show({
      text: `Restored ${bookCount(pending.books.length)} and ${goalCount(pending.goals.length)} from your backup.`,
      action: {
        label: 'Undo',
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const undone = await restoreBackup(was);
          if (undone) return status.show({ text: undone });
          await router.invalidate();
          status.show({ text: 'Your atlas is as it was.' });
        },
      },
    });
  };

  const exported = pending?.exported ? new Date(pending.exported) : null;
  const when =
    exported && !isNaN(exported.getTime())
      ? exported.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'an earlier date';

  return (
    <>
      <button
        type="button"
        className={button({ variant: 'quiet' })}
        onClick={() => file.current?.click()}
      >
        <UploadSimpleIcon aria-hidden="true" />
        Restore a backup (JSON)
      </button>
      <input
        ref={file}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={pick}
      />

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={dialog}
        className={s.dialog}
        aria-labelledby="ac-restore-title"
        aria-describedby="ac-restore-q"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={s.dialogHead}>
          <h2 className={s.dialogTitle} id="ac-restore-title">
            Restore this backup?
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
        {pending && (
          <p className={s.dialogText} id="ac-restore-q">
            {`This replaces your atlas (${atlasWords(books.length, goals.length)}) with the backup from ${when}: ${bookCount(pending.books.length)} and ${goalCount(pending.goals.length)}. You can undo it for a few seconds afterwards.`}
          </p>
        )}
        <div className={s.dialogActions}>
          <Button
            id="ac-restore-keep"
            type="button"
            variant="text"
            onClick={close}
          >
            Keep this atlas
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={restoring}
            onClick={restore}
          >
            <UploadSimpleIcon aria-hidden="true" />
            Restore backup
          </Button>
        </div>
      </dialog>
    </>
  );
};

export default RestoreBackup;
