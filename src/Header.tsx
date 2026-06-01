import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="header">
      <span className="title">Read The Globe</span>
      <div className="right-header">
        <button className="button">+ Add Book</button>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
