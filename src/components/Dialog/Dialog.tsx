import { XIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

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
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="dialog">
        {canClose && (
          <button
            className="closeButton"
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
    <div className="dialog-header">
      <h2 className="title">{children}</h2>
    </div>
  );
};

type DialogContentProps = {
  children: ReactNode;
};

export const DialogContent = ({ children }: DialogContentProps) => {
  return <div className="content">{children}</div>;
};

export default Dialog;
