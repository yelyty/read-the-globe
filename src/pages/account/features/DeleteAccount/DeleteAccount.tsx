import { useState } from 'react';
import { TrashIcon } from '@phosphor-icons/react';

import type { BookEntry } from '../../../../types';
import * as styles from './DeleteAccount.css';
import { Button } from '../../../../components/Button/Button';
import ConfirmationDialog from './ConfirmationDialog';
import { m } from '../../../../paraglide/messages.js';

type DeleteAccountProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

const DeleteAccount = ({ books, names }: DeleteAccountProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dangerItem}>
      <h3 className={styles.itemTitle}>{m.account_delete()}</h3>
      <p className={styles.itemText}>{m.account_delete_text()}</p>
      <Button
        type="button"
        variant="dangerOutline"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <TrashIcon aria-hidden="true" />
        {m.account_delete()}
      </Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        books={books}
        names={names}
      />
    </div>
  );
};

export default DeleteAccount;
