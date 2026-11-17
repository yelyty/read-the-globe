import { useRef, useState, type ChangeEvent } from 'react';
import { UploadSimpleIcon } from '@phosphor-icons/react';

import type { BookEntry, Goal } from '../../../../../types';
import {
  getBackup,
  restoreBackup,
  type Backup,
} from '../../../../../api/data/data';
import { useRefresh } from '../../../../../hooks/useReader';
import { useStatus } from '../../../../../hooks/useStatus';
import { useUndo } from '../../../../../hooks/useUndo';
import { Button } from '../../../../../components/Button/Button';
import { button } from '../../../../../components/Button/Button.css';
import Dialog from '../../../../../components/Dialog/Dialog';
import DialogActions from '../../../../../components/Dialog/DialogActions';
import DialogText from '../../../../../components/Dialog/DialogText';
import { m } from '../../../../../paraglide/messages.js';
import { getLocale } from '../../../../../paraglide/runtime.js';
import { atlasWords, bookCount, goalCount } from '../readingList/readingList';

type RestoreBackupProps = {
  userId: string;
  books: BookEntry[];
  goals: Goal[];
  /** a file that isn't a backup, in words */
  onFail: (text: string) => void;
};

// Restore a backup (JSON): it replaces the atlas after a confirmation, and Undo puts the atlas back as it was
const RestoreBackup = ({
  userId,
  books,
  goals,
  onFail,
}: RestoreBackupProps) => {
  const refresh = useRefresh();
  const status = useStatus();
  const offerUndo = useUndo();
  const file = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
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
      onFail(m.account_not_a_backup());

      return;
    }

    setPending(data as Backup);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const restore = async () => {
    if (!pending) return;
    setRestoring(true);
    // the atlas as it is now, exported first so Undo can restore it
    const was = await getBackup(userId).catch(() => null);

    const problem = was
      ? await restoreBackup(pending)
      : m.data_restore_failed();

    setRestoring(false);
    close();

    if (problem || !was) {
      status.show({ text: problem ?? '' });

      return;
    }

    await refresh();

    offerUndo({
      said: m.account_restored({
        books: bookCount(pending.books.length),
        goals: goalCount(pending.goals.length),
      }),
      undo: () => restoreBackup(was),
      undone: m.account_as_it_was(),
    });
  };

  const exported = pending?.exported ? new Date(pending.exported) : null;

  const when =
    exported && !isNaN(exported.getTime())
      ? exported.toLocaleDateString(getLocale(), {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : m.account_earlier_date();

  const handleChooseFile = () => file.current?.click();

  return (
    <>
      <button
        type="button"
        className={button({ variant: 'quiet' })}
        onClick={handleChooseFile}
      >
        <UploadSimpleIcon aria-hidden="true" />
        {m.account_restore_button()}
      </button>
      <input
        ref={file}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={pick}
      />

      <Dialog
        open={open}
        onClose={close}
        title={m.account_restore_question()}
        initialFocus="ac-restore-keep"
        aria-describedby="ac-restore-q"
      >
        {pending && (
          <DialogText id="ac-restore-q">
            {m.account_restore_dialog({
              now: atlasWords(books.length, goals.length),
              when,
              books: bookCount(pending.books.length),
              goals: goalCount(pending.goals.length),
            })}
          </DialogText>
        )}
        <DialogActions>
          <Button
            id="ac-restore-keep"
            type="button"
            variant="text"
            onClick={close}
          >
            {m.account_keep_atlas()}
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={restoring}
            aria-busy={restoring || undefined}
            onClick={restore}
          >
            <UploadSimpleIcon aria-hidden="true" />
            {restoring ? m.account_restoring() : m.account_restore_confirm()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RestoreBackup;
