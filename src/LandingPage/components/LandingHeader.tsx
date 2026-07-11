import { GlobeStandIcon } from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
// import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import * as s from "../LandingPage.css";

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
      </nav>
      <div className={s.headerActions}>
        <Button variant="outlined" onClick={openSignIn}>
          Log in
        </Button>
        <Button onClick={openSignUp}>Sign up</Button>
        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
};

export default LandingHeader;
