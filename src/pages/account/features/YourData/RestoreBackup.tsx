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
import { m } from '../../../../paraglide/messages.js';
import { getLocale } from '../../../../paraglide/runtime.js';

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
      onFail(m.account_not_a_backup());
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
      : m.data_restore_failed();
    setRestoring(false);
    close();
    if (problem || !was) {
      status.show({ text: problem ?? '' });
      return;
    }
    await router.invalidate();
    status.show({
      text: m.account_restored({
        books: bookCount(pending.books.length),
        goals: goalCount(pending.goals.length),
      }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const undone = await restoreBackup(was);
          if (undone) return status.show({ text: undone });
          await router.invalidate();
          status.show({ text: m.account_as_it_was() });
        },
      },
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

  return (
    <>
      <button
        type="button"
        className={button({ variant: 'quiet' })}
        onClick={() => file.current?.click()}
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
            {m.account_restore_question()}
          </h2>
          <button
            type="button"
            className={s.close}
            aria-label={m.common_close()}
            onClick={close}
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>
        {pending && (
          <p className={s.dialogText} id="ac-restore-q">
            {m.account_restore_dialog({
              now: atlasWords(books.length, goals.length),
              when,
              books: bookCount(pending.books.length),
              goals: goalCount(pending.goals.length),
            })}
          </p>
        )}
        <div className={s.dialogActions}>
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
            onClick={restore}
          >
            <UploadSimpleIcon aria-hidden="true" />
            {m.account_restore_confirm()}
          </Button>
        </div>
      </dialog>
    </>
  );
};

export default RestoreBackup;
