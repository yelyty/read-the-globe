import { useRef } from 'react';
import { TrashIcon } from '@phosphor-icons/react';

import type { BookEntry } from '../../../../types';
import * as s from './DeleteAccount.css';
import Block from '../../components/Block';
import { Button } from '../../../../components/Button/Button';
import ConfirmationDialog from './ConfirmationDialog';

type DeleteAccountProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

const DeleteAccount = ({ books, names }: DeleteAccountProps) => {
  const dialog = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialog.current?.showModal();
    document.getElementById('ac-delete-word')?.focus();
  };

  return (
    <Block title="Start over" danger>
      <div className={s.dangerItem}>
        <h3 className={s.itemTitle}>Delete account</h3>
        <p className={s.itemText}>
          Removes your account and your atlas. This can’t be undone.
        </p>
        <Button
          type="button"
          variant="dangerOutline"
          aria-haspopup="dialog"
          onClick={open}
        >
          <TrashIcon aria-hidden="true" />
          Delete account
        </Button>
      </div>
      <ConfirmationDialog ref={dialog} books={books} names={names} />
    </Block>
  );
};

export default DeleteAccount;
