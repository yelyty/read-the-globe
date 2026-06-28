import { GlobeStandIcon } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  authorized: boolean;
  onAddBookClick?: () => void;
};

const Header = ({ authorized = false, onAddBookClick }: HeaderProps) => {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <GlobeStandIcon size={32} style={{ color: "var(--color-text)" }} />
        <span className="title">Read The Globe</span>
      </div>
      <div className="right-header">
        {!authorized && (
          <nav>
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="/signin">Sign in</a>
          </nav>
        )}
        {authorized && (
          <button className="button" onClick={onAddBookClick}>
            + Add Book
          </button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
