import { useEffect, useRef, useState } from "react";
import { ListIcon, PushPinIcon } from "@phosphor-icons/react";
import * as s from "./Header.css";
import ThemeButton from "../../../../components/ThemeButton/ThemeButton";
import Logo from "../../../../components/Logo/Logo";

const SECTIONS = [
  { href: "#how", label: "The atlas" },
  { href: "#goals", label: "Goals" },
];

type HeaderProps = {
  onLogIn: () => void;
  onSignUp: () => void;
};

const Header = ({ onLogIn, onSignUp }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // phones: Escape, a tap outside or the screen growing past 800px closes the menu
  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
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
    const wide = window.matchMedia("(min-width: 800px)");
    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  return (
    <header className={s.header}>
      <div className={s.topRow}>
        <a href="#top" className={s.brand} aria-label="Read The Globe, home">
          <Logo className={s.logo} />
          <span className={s.brandWord}>Read The Globe</span>
        </a>

        <nav className={s.track} aria-label="Sections">
          {SECTIONS.map((section) => (
            <a key={section.href} className={s.trackLink} href={section.href}>
              {section.label}
            </a>
          ))}
        </nav>
        <div className={s.tools}>
          <ThemeButton />
        </div>
        <button type="button" className={s.login} onClick={onLogIn}>
          Log in
        </button>
        <button type="button" className={s.start} onClick={onSignUp}>
          <PushPinIcon weight="fill" aria-hidden="true" />
          <span>Start your atlas</span>
        </button>

        <button
          ref={menuBtnRef}
          type="button"
          className={s.menuBtn}
          aria-expanded={menuOpen}
          aria-controls="header-menu"
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <ListIcon aria-hidden="true" />
        </button>
        <nav
          ref={menuRef}
          id="header-menu"
          className={s.menu}
          aria-label="Menu"
          hidden={!menuOpen}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a, button"))
              setMenuOpen(false);
          }}
        >
          {SECTIONS.map((section) => (
            <a key={section.href} className={s.menuItem} href={section.href}>
              {section.label}
            </a>
          ))}
          <button
            type="button"
            className={`${s.menuItem} ${s.menuLogin}`}
            onClick={onLogIn}
          >
            Log in
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
