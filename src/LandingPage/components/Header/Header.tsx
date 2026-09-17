import { MapPinIcon } from "@phosphor-icons/react";
import * as s from "./Header.css";
import ThemeButton from "../../../components/ThemeButton/ThemeButton";
import Logo from "../../../components/Logo/Logo";

type HeaderProps = {
  onLogIn: () => void;
};

const Header = ({ onLogIn }: HeaderProps) => {
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
        <a href="#start" className={s.pill}>
          <MapPinIcon weight="fill" aria-hidden="true" />
          <span>Start your atlas</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
