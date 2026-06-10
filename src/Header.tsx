import { GlobeStandIcon } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  onAddBookClick: () => void;
};

const Header = ({ onAddBookClick }: HeaderProps) => {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <GlobeStandIcon size={32} style={{ color: "var(--color-text)" }} />
        <span className="title">Read The Globe</span>
      </div>
      <div className="right-header">
        <button className="button" onClick={onAddBookClick}>
          + Add Book
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
