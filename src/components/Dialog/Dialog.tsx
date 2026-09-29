import { XIcon } from "@phosphor-icons/react";
import { useEffect, type ReactNode } from "react";
import * as s from "./Dialog.css";

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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, canClose, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.dialog}>
        {canClose && (
          <button
            className={s.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
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
    <div className={s.header}>
      <h2 className="title">{children}</h2>
    </div>
  );
};

type DialogContentProps = {
  children: ReactNode;
};

export const DialogContent = ({ children }: DialogContentProps) => {
  return <div className={s.content}>{children}</div>;
};

export default Dialog;
