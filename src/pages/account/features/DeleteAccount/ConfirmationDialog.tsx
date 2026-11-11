import { useState, type RefObject, type SubmitEvent } from 'react';
import { useRouter } from '@tanstack/react-router';
import { XIcon, TrashIcon } from '@phosphor-icons/react';
import Field from '../../../../components/Field/Field';
import { getLocale } from '../../../../paraglide/runtime.js';
import { deleteAccount } from '../../../../api/Profile/deleteAccount';

import * as styles from './DeleteAccount.css';
import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import KeepCopy from './KeepCopy';
import { m } from '../../../../paraglide/messages.js';

type ConfirmationDialogProps = {
  books: BookEntry[];
  names: Record<string, string>;
  ref: RefObject<HTMLDialogElement | null>;
};

const ConfirmationDialog = ({ books, names, ref }: ConfirmationDialogProps) => {
  const router = useRouter();

  const [word, setWord] = useState('');
  // a new KeepCopy each time the dialog opens, so its "Saved" line starts empty
  const [round, setRound] = useState(0);
  const [error, setError] = useState<string>();
  const [deleting, setDeleting] = useState(false);

  const close = () => ref.current?.close();

  const reset = () => {
    setWord('');
    setRound((prev) => prev + 1);
    setError(undefined);
  };

  // the word is typed in the reader's language: delete, smazat, видалити
  const confirmed =
    word.trim().toLocaleLowerCase(getLocale()) === m.account_delete_word();

  const what = books.length
    ? m.account_and({
        a: m.account_your_account(),
        b: m.count_book({ count: books.length }),
      })
    : m.account_your_account();

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirmed) return;
    setDeleting(true);
    const problem = await deleteAccount();

    setDeleting(false);

    if (problem) {
      setError(m.account_delete_failed());

      return;
    }

    close();
    router.clearCache();
    await router.navigate({ to: '/' });
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={ref}
        className={styles.dialog}
        aria-labelledby="ac-delete-title"
        aria-describedby="ac-delete-q"
        onClose={reset}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <form onSubmit={submit} noValidate>
          <div className={styles.dialogHead}>
            <h2 className={styles.dialogTitle} id="ac-delete-title">
              {m.account_delete_question()}
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
          <p className={styles.dialogText} id="ac-delete-q">
            {m.account_delete_dialog({ what })}
          </p>
          <KeepCopy key={round} books={books} names={names} />
          <Field
            id="ac-delete-word"
            label={m.account_delete_word_label()}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            value={word}
            error={error}
            onChange={(event) => setWord(event.target.value)}
          />
          <div className={styles.dialogActions}>
            <Button type="button" variant="text" onClick={close}>
              {m.account_keep_account()}
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={!confirmed || deleting}
            >
              <TrashIcon aria-hidden="true" />
              {m.account_delete()}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default ConfirmationDialog;
