import { PushPinIcon } from "@phosphor-icons/react";
import * as s from "./Header.css";
import ThemeButton from "../../../../components/ThemeButton/ThemeButton";
import Logo from "../../../../components/Logo/Logo";

type HeaderProps = {
  onLogIn: () => void;
  onSignUp: () => void;
};

const Header = ({ onLogIn, onSignUp }: HeaderProps) => {
  return (
    <header className={s.header}>
      <div className={s.headerRow}>
        {/* TODO: Add SVG logo */}
        <a href="#top" className={s.logoLink} aria-label="Read The Globe, home">
          <Logo className={s.logo} />
          <span className={s.logoTitle}>Read The Globe</span>
        </a>

        <nav className={s.nav} aria-label="Sections">
          <a className={s.navLink} href="#how">
            The atlas
          </a>
          <a className={s.navLink} href="#goals">
            Goals
          </a>
        </nav>
        <ThemeButton />
        <button type="button" className={s.loginBtn} onClick={onLogIn}>
          Log in
        </button>
        <button type="button" className={s.pill} onClick={onSignUp}>
          <PushPinIcon weight="fill" aria-hidden="true" />
          <span>Start your atlas</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
