import { Link } from "@tanstack/react-router";
import { PushPinIcon } from "@phosphor-icons/react";
import * as h from "../../pages/LandingPage/components/Header/Header.css";
import * as s from "./AppHeader.css";
import ThemeButton from "../ThemeButton/ThemeButton";
import Logo from "../Logo/Logo";
import AccountMenu from "../AccountMenu/AccountMenu";

const AppHeader = () => {
  return (
    <header className={h.header}>
      <div className={s.row}>
        <Link to="/app" className={h.brand} aria-label="Read The Globe, home">
          <Logo className={h.logo} />
          <span className={h.brandWord}>Read The Globe</span>
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
        <div className={s.tools}>
          <ThemeButton />
          <Link
            className={h.start}
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            <span>Log a book</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
