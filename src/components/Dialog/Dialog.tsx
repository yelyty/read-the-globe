import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { XIcon } from '@phosphor-icons/react';

import { canDiscard } from '../../hooks/useUnsaved';
import { m } from '../../paraglide/messages.js';
import * as styles from './Dialog.css';

type DialogProps = Omit<
  ComponentProps<'dialog'>,
  'open' | 'onClose' | 'onCancel' | 'title' | 'ref'
> & {
  /** the dialog is modal while this is true; the parent owns it */
  open: boolean;
  /** asked to close: ×, Esc or a click on the backdrop. The parent sets `open` to false (or unmounts) */
  onClose: () => void;
  title: ReactNode;
  /** a line or two under the title, in the header */
  sub?: ReactNode;
  /** id of the element that takes focus when the dialog opens */
  initialFocus?: string;
  /** while true, Esc and the backdrop ask before closing; × still closes at once, it's a choice, not a slip */
  dirty?: boolean;
  /** false keeps a click on the backdrop from closing it */
  backdropClose?: boolean;
  variant?: keyof typeof styles.dialog;
};

/**
 * Shows a modal dialog. The app uses this one dialog for all its modals.
 * It uses the native dialog element, so focus stays inside, the page behind is inert, and Esc closes it.
 * @param open - If true, the dialog is open. The parent controls it.
 * @param onClose - Called when the reader closes the dialog with ×, Esc, or a click on the backdrop.
 * @param dirty - If true, Esc and the backdrop ask before the dialog closes. × still closes it at once.
 * @param backdropClose - If false, a click on the backdrop does not close the dialog.
 */
const Dialog = ({
  open,
  onClose,
  title,
  sub,
  initialFocus,
  dirty = false,
  backdropClose = true,
  variant = 'default',
  className,
  children,
  ...rest
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      if (initialFocus) document.getElementById(initialFocus)?.focus();
    }

    if (!open && dialog.open) dialog.close();
    // initialFocus is read once, as the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    if (canDiscard(dirty)) onClose();
  };

  // Esc: the browser would close it behind our back, so the parent decides instead
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    dismiss();
  };

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (!backdropClose || event.target !== event.currentTarget) return;
    // the dialog's own padding is the dialog too: only a click outside its box is the backdrop
    const box = event.currentTarget.getBoundingClientRect();

    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;

    if (!inside) dismiss();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard
    <dialog
      ref={ref}
      className={[styles.dialog[variant], className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      {...rest}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className={styles.head[variant]}>
        <div>
          <h2 className={styles.title[variant]} id={titleId}>
            {title}
          </h2>
          {sub}
        </div>
        <button
          type="button"
          className={styles.close}
          aria-label={m.common_close()}
          onClick={onClose}
        >
          <XIcon aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
};

export default Dialog;
