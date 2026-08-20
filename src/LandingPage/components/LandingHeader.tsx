import { GlobeStandIcon, MapPinLineIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
// import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import * as s from "../LandingPage.css";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

const LOGO_ICON_SIZE = 30;

const LandingHeader = () => {
  const openSignUp = () => {
    // wire sign-up modal
  };

  const openSignIn = () => {
    // wire login
  };
  return (
    <header className={s.header}>
      <div className={s.logoWrapper}>
        {/* TODO: Add SVG logo */}
        <GlobeStandIcon size={LOGO_ICON_SIZE} weight="bold" />
        <span className={s.logoTitle}>Read The Globe</span>
      </div>
      <nav className={s.nav}>
        <a className={s.navLink} href="#how">
          How it works
        </a>
        <a className={s.navLink} href="#features">
          Features
        </a>
        <a className={s.navLink} href="#goals">
          Goals
        </a>
        <ThemeToggle />
        <div className={s.headerActions}>
          <Button variant="text" size="md" onClick={openSignIn}>
            Log in
          </Button>
          <Button size="md" onClick={openSignUp}>
            <MapPinLineIcon size={22} />
            Start your map
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;
