import { Link } from "@tanstack/react-router";
import { PushPinIcon } from "@phosphor-icons/react";
import * as s from "../../pages/LandingPage/components/Header/Header.css";
import ThemeButton from "../ThemeButton/ThemeButton";
import Logo from "../Logo/Logo";
import AccountMenu from "../AccountMenu/AccountMenu";

const AppHeader = () => {
  return (
    <header className={s.header}>
      <div className={s.headerRow}>
        <Link
          to="/app"
          className={s.logoLink}
          aria-label="Read The Globe, home"
        >
          <Logo className={s.logo} />
          <span className={s.logoTitle}>Read The Globe</span>
        </Link>

        <nav className={s.nav} aria-label="Main">
          <Link
            className={s.navLink}
            to="/app"
            activeOptions={{ exact: true, includeSearch: false }}
          >
            Home
          </Link>
          <Link className={s.navLink} to="/app/shelf">
            Shelf
          </Link>
          <Link className={s.navLink} to="/app/goals">
            Goals
          </Link>
          <Link className={s.navLink} to="/app/postcard">
            Postcard
          </Link>
          <AccountMenu />
        </nav>
        <ThemeButton />
        <Link
          className={s.pill}
          to="."
          search={(prev) => ({ ...prev, log: true })}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          <span>Log a book</span>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;
