import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { TrashIcon } from '@phosphor-icons/react';

import Field from '../../../../components/Field/Field';
import { getLocale } from '../../../../paraglide/runtime.js';
import { deleteAccount } from '../../../../api/profile/profile';
import type { BookEntry } from '../../../../types';
import Button from '../../../../components/Button/Button';
import Dialog from '../../../../components/Dialog/Dialog';
import DialogActions from '../../../../components/Dialog/DialogActions';
import DialogText from '../../../../components/Dialog/DialogText';
import { m } from '../../../../paraglide/messages.js';
import KeepCopy from './KeepCopy';

type ConfirmationDialogProps = {
  books: BookEntry[];
  names: Record<string, string>;
  open: boolean;
  onClose: () => void;
};

/**
 * Shows the dialog that confirms the removal of the account.
 * The reader must type a confirmation word in the language of the app. Then the Delete button becomes available.
 * Before the removal, the reader can save the reading list from the dialog.
 */
const ConfirmationDialog = ({
  books,
  names,
  open,
  onClose,
}: ConfirmationDialogProps) => {
  const [word, setWord] = useState('');
  // a new KeepCopy each time the dialog opens, so its "Saved" line starts empty
  const [round, setRound] = useState(0);
  const [error, setError] = useState<string>();
  const [deleting, setDeleting] = useState(false);

  const close = () => {
    onClose();
    setWord('');
    setRound((prev) => prev + 1);
    setError(undefined);
  };

  // the word is typed in the reader's language
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

    // the account is gone and signed out
    close();
  };

  const handleWordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setWord(event.target.value);

  return (
    <Dialog
      open={open}
      onClose={close}
      title={m.account_delete_question()}
      initialFocus="ac-delete-word"
      aria-describedby="ac-delete-q"
    >
      <form onSubmit={submit} noValidate>
        <DialogText id="ac-delete-q">
          {m.account_delete_dialog({ what })}
        </DialogText>
        <KeepCopy key={round} books={books} names={names} />
        <Field
          id="ac-delete-word"
          label={m.account_delete_word_label()}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          value={word}
          error={error}
          onChange={handleWordChange}
        />
        <DialogActions>
          <Button type="button" variant="text" onClick={close}>
            {m.account_keep_account()}
          </Button>
          <Button
            type="submit"
            variant="danger"
            disabled={!confirmed || deleting}
            aria-busy={deleting || undefined}
          >
            <TrashIcon aria-hidden="true" />
            {deleting ? m.account_deleting() : m.account_delete()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ConfirmationDialog;
