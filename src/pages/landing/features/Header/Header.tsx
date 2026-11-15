import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ListIcon, PushPinIcon } from '@phosphor-icons/react';

import { useAuth } from '../../../../auth/auth-context';
import ThemeButton from '../../../../components/ThemeButton/ThemeButton';
import Logo from '../../../../components/Logo/Logo';
import { m } from '../../../../paraglide/messages.js';
import { skip } from '../../LandingPage.css';
import { SECTIONS } from '../../utils/sections';
import * as styles from './Header.css';
import SectionLink from './SectionLink';
import { useCurrentSection } from './useCurrentSection';

type HeaderProps = {
  onLogIn: () => void;
  onSignUp: () => void;
};

const Header = ({ onLogIn, onSignUp }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const current = useCurrentSection();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector('a')?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuBtnRef.current?.focus();
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        !menuRef.current?.contains(target) &&
        !menuBtnRef.current?.contains(target)
      )
        setMenuOpen(false);
    };

    const wide = window.matchMedia('(min-width: 800px)');

    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    wide.addEventListener('change', onWide);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      wide.removeEventListener('change', onWide);
    };
  }, [menuOpen]);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleMenuClose = () => setMenuOpen(false);

  const handleMenuLogIn = () => {
    setMenuOpen(false);
    onLogIn();
  };

  return (
    <>
      <a className={skip} href="#main">
        {m.landing_skip()}
      </a>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <a href="/#top" className={styles.brand} aria-label={m.brand_home()}>
            <Logo className={styles.logo} />
            <span className={styles.brandWord}>Read The Globe</span>
          </a>

          <nav className={styles.track} aria-label={m.landing_sections()}>
            {/* the bar's section links mark the one on screen */}
            {SECTIONS.map((section) => (
              <SectionLink
                key={section.hash}
                section={section}
                className={styles.trackLink}
                current={current === section.hash}
              />
            ))}
          </nav>
          <div className={styles.tools}>
            <ThemeButton />
          </div>
          {isAuthenticated ? (
            <Link to="/app" className={styles.login}>
              {m.landing_your_atlas()}
            </Link>
          ) : (
            <button type="button" className={styles.login} onClick={onLogIn}>
              {m.landing_log_in()}
            </button>
          )}
          <button type="button" className={styles.start} onClick={onSignUp}>
            <PushPinIcon weight="fill" aria-hidden="true" />
            <span>{m.landing_start()}</span>
          </button>

          <button
            ref={menuBtnRef}
            type="button"
            className={styles.menuBtn}
            aria-expanded={menuOpen}
            aria-controls="header-menu"
            aria-label={m.landing_menu()}
            onClick={handleMenuToggle}
          >
            <ListIcon aria-hidden="true" />
          </button>
          <nav
            ref={menuRef}
            id="header-menu"
            className={styles.menu}
            aria-label={m.landing_menu()}
            hidden={!menuOpen}
          >
            {/* the phone menu's section links close the menu */}
            {SECTIONS.map((section) => (
              <SectionLink
                key={section.hash}
                section={section}
                className={styles.menuItem}
                onClick={handleMenuClose}
              />
            ))}
            {isAuthenticated ? (
              <Link
                to="/app"
                className={`${styles.menuItem} ${styles.menuLogin}`}
              >
                {m.landing_your_atlas()}
              </Link>
            ) : (
              <button
                type="button"
                className={`${styles.menuItem} ${styles.menuLogin}`}
                onClick={handleMenuLogIn}
              >
                {m.landing_log_in()}
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
