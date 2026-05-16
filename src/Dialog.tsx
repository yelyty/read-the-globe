import type { ReactNode } from "react";

type DialogProps = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
};

const Dialog = ({ isOpen, onClose, children }: DialogProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="dialog">
        <button
          className="closeButton"
          onClick={onClose}
          aria-label="Close dialog"
        >
          X
        </button>
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
    <div className="header">
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

type DialogActionsProps = {
  children: ReactNode;
};

export const DialogActions = ({ children }: DialogActionsProps) => {
  return <div className="actions">{children}</div>;
};

export default Dialog;
