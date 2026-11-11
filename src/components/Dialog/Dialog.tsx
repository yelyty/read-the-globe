import { XIcon } from '@phosphor-icons/react';
import { useEffect, type ReactNode } from 'react';
import * as styles from './Dialog.css';
import { m } from '../../paraglide/messages.js';

type DialogProps = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  canClose?: boolean;
};

const Dialog = ({
  isOpen,
  onClose,
  children,
  canClose = true,
}: DialogProps) => {
  useEffect(() => {
    if (!isOpen || !canClose) return;

    const onKey = (keyEvent: KeyboardEvent) =>
      keyEvent.key === 'Escape' && onClose();

    document.addEventListener('keydown', onKey);

    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, canClose, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (clickEvent: React.MouseEvent) => {
    if (clickEvent.target === clickEvent.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div className={styles.dialog}>
        {canClose && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={m.dialog_close()}
          >
            <XIcon size={32} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

type DialogTitleProps = {
  children: ReactNode;
};

export const DialogTitle = ({ children }: DialogTitleProps) => {
  return (
    <div className={styles.header}>
      <h2 className="title">{children}</h2>
    </div>
  );
};

type DialogContentProps = {
  children: ReactNode;
};

export const DialogContent = ({ children }: DialogContentProps) => {
  return <div className={styles.content}>{children}</div>;
};

export default Dialog;
