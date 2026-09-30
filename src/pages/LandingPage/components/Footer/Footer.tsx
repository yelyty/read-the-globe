import { Link } from "@tanstack/react-router";
import Logo from "../../../../components/Logo/Logo";
import * as s from "./Footer.css";

const COLUMNS = [
  {
    id: "footer-product",
    title: "Product",
    links: [
      { label: "The atlas", to: "/", hash: "how" },
      { label: "Goals", to: "/", hash: "goals" },
    ],
  },
  {
    id: "footer-company",
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Roadmap", to: "/roadmap" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    id: "footer-legal",
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
] as const;

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.footerGrid}>
          <div>
            <a
              href="#top"
              className={s.logoLink}
              aria-label="Read The Globe, back to the top"
            >
              <Logo className={s.logo} />
              <span className={s.logoTitle}>Read The Globe</span>
            </a>
            <p className={s.footerTag}>Read the world, one book at a time.</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.id} aria-labelledby={column.id}>
              <h2 className={s.footerHead} id={column.id}>
                {column.title}
              </h2>
              <ul className={s.footerList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className={s.footerLink}
                      to={link.to}
                      hash={"hash" in link ? link.hash : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={s.footerTail}>
          <span>© 2026 Read The Globe</span>
          <span>195 countries · one shelf at a time</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
