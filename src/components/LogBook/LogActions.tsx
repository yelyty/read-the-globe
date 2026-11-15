import { PushPinIcon, TrashIcon } from '@phosphor-icons/react';

import { m } from '../../paraglide/messages.js';
import { Button } from '../Button/Button';
import * as styles from './LogBook.css';

type LogActionsProps = {
  /** a book being edited: Remove and Cancel, rather than Close */
  editing: boolean;
  saving: boolean;
  /** the submit button's words: Pin it, Save changes, Pin it again… */
  label: string;
  onRemove: () => void;
  onClose: () => void;
};

// the form's foot: Remove (when editing), Cancel or Close, and Pin it
const LogActions = ({
  editing,
  saving,
  label,
  onRemove,
  onClose,
}: LogActionsProps) => (
  <div className={styles.actions}>
    {editing ? (
      <>
        <Button
          type="button"
          variant="link"
          className={styles.danger}
          disabled={saving}
          onClick={onRemove}
        >
          <TrashIcon aria-hidden="true" />
          {m.log_remove()}
        </Button>
        <Button type="button" variant="link" onClick={onClose}>
          {m.common_cancel()}
        </Button>
      </>
    ) : (
      <Button type="button" variant="link" onClick={onClose}>
        {m.common_close()}
      </Button>
    )}
    <Button
      type="submit"
      variant="primary"
      className={styles.submit}
      disabled={saving}
      aria-busy={saving || undefined}
    >
      <PushPinIcon aria-hidden="true" />
      {label}
    </Button>
  </div>
);

export default LogActions;
