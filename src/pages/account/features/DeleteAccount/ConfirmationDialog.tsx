import { useState, type SubmitEvent } from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import Field from '../../../../components/Field/Field';
import { getLocale } from '../../../../paraglide/runtime.js';
import { deleteAccount } from '../../../../api/Profile/deleteAccount';

import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import Dialog, {
  DialogActions,
  DialogText,
} from '../../../../components/Dialog/Dialog';
import KeepCopy from './KeepCopy';
import { m } from '../../../../paraglide/messages.js';

type ConfirmationDialogProps = {
  books: BookEntry[];
  names: Record<string, string>;
  open: boolean;
  onClose: () => void;
};

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

  // closed, it starts over: no typed word, no error, a fresh KeepCopy
  const close = () => {
    onClose();
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

    // the account is gone and signed out: App takes the reader back to '/'
    close();
  };

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
          onChange={(event) => setWord(event.target.value)}
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
