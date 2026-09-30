import { Link } from "@tanstack/react-router";
import * as s from "./AppFooter.css";

const LINKS = [
  { label: "About", to: "/about" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
] as const;

const AppFooter = () => {
  return (
    <footer className={s.footer}>
      <div className={s.row}>
        <p>© 2026 Read The Globe</p>
        <nav className={s.links} aria-label="About Read The Globe">
          {LINKS.map((link) => (
            <Link key={link.to} className={s.link} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className={s.credit}>
          Map data from{" "}
          <a
            className={s.link}
            href="https://www.naturalearthdata.com/"
            rel="noopener"
          >
            Natural Earth
          </a>
          , public domain
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
