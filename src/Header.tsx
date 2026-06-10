import { GlobeStandIcon } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-wrapper">
        <GlobeStandIcon size={32} />
        <span className="title">Read The Globe</span>
      </div>
      <div className="right-header">
        <button className="button">+ Add Book</button>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
