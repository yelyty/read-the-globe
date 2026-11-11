import { useState, type RefObject, type SubmitEvent } from 'react';
import { useRouter } from '@tanstack/react-router';
import { XIcon, TrashIcon } from '@phosphor-icons/react';
import Field from '../../../../components/Field/Field';
import { bookCount } from '../YourData/readingList';
import { deleteAccount } from '../../../../api/Profile/deleteAccount';

import * as s from './DeleteAccount.css';
import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import KeepCopy from './KeepCopy';

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
    setRound((r) => r + 1);
    setError(undefined);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (word.trim().toLowerCase() !== 'delete') return;
    setDeleting(true);
    const problem = await deleteAccount();
    setDeleting(false);
    if (problem) {
      setError('Your account couldn’t be deleted. Try again.');
      return;
    }
    close();
    router.clearCache();
    await router.navigate({ to: '/' });
  };

  const confirmed = word.trim().toLowerCase() === 'delete';

  const hasBooks = books.length > 0;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard */}
      <dialog
        ref={ref}
        className={s.dialog}
        aria-labelledby="ac-delete-title"
        aria-describedby="ac-delete-q"
        onClose={reset}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <form onSubmit={submit} noValidate>
          <div className={s.dialogHead}>
            <h2 className={s.dialogTitle} id="ac-delete-title">
              Delete your account?
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
          <p className={s.dialogText} id="ac-delete-q">
            This deletes your account
            {hasBooks ? ` and ${bookCount(books.length)}` : ''}. It can’t be
            undone.
          </p>
          <KeepCopy key={round} books={books} names={names} />
          <Field
            id="ac-delete-word"
            label="Type delete to confirm"
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            value={word}
            error={error}
            onChange={(event) => setWord(event.target.value)}
          />
          <div className={s.dialogActions}>
            <Button type="button" variant="text" onClick={close}>
              Keep account
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={!confirmed || deleting}
            >
              <TrashIcon aria-hidden="true" />
              Delete account
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default ConfirmationDialog;
