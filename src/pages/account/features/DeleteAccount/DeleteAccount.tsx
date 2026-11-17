import { useState } from 'react';
import { TrashIcon } from '@phosphor-icons/react';

import type { BookEntry } from '../../../../types';
import { Button } from '../../../../components/Button/Button';
import { m } from '../../../../paraglide/messages.js';
import * as styles from '../../AccountPage.css';
import ConfirmationDialog from './ConfirmationDialog';

type DeleteAccountProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

const DeleteAccount = ({ books, names }: DeleteAccountProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={styles.dangerItem}>
      <h3 className={styles.itemTitle}>{m.account_delete()}</h3>
      <p className={styles.itemText}>{m.account_delete_text()}</p>
      <Button
        type="button"
        variant="dangerOutline"
        aria-haspopup="dialog"
        onClick={handleOpen}
      >
        <TrashIcon aria-hidden="true" />
        {m.account_delete()}
      </Button>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        books={books}
        names={names}
      />
    </div>
  );
};

export default DeleteAccount;
