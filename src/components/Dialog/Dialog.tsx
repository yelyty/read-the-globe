import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { XIcon } from '@phosphor-icons/react';
import { canDiscard } from '../../hooks/useUnsaved';
import * as styles from './Dialog.css';
import { m } from '../../paraglide/messages.js';

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

// one modal for the whole app: the native <dialog>, opened with showModal() so focus is trapped,
// the page goes inert and Esc works without any listener of ours
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

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop click; Esc closes it from the keyboard
    <dialog
      ref={ref}
      className={[styles.dialog[variant], className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      {...rest}
      // Esc: the browser would close it behind our back, so the parent decides instead
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (!backdropClose || event.target !== event.currentTarget) return;
        // the dialog's own padding is the dialog too: only a click outside its box is the backdrop
        const box = event.currentTarget.getBoundingClientRect();

        const inside =
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom;

        if (!inside) dismiss();
      }}
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
          className={styles.close[variant]}
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

type DialogTextProps = ComponentProps<'p'>;

/** the explaining paragraph under the header */
export const DialogText = ({ className, ...rest }: DialogTextProps) => (
  <p className={[styles.text, className].filter(Boolean).join(' ')} {...rest} />
);

type DialogActionsProps = { children: ReactNode };

/** the buttons row at the foot: the safe choice first, the action last */
export const DialogActions = ({ children }: DialogActionsProps) => (
  <div className={styles.actions}>{children}</div>
);

export default Dialog;
