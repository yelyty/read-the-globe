import Logo from "../../../../components/Logo/Logo";
import * as s from "./Footer.css";

const COLUMNS = [
  {
    id: "footer-product",
    title: "Product",
    links: [
      ["The atlas", "#how"],
      ["Goals", "#goals"],
    ],
  },
  {
    id: "footer-company",
    title: "Company",
    links: [
      ["About", "/about.html"],
      ["Roadmap", "/roadmap.html"],
      ["Contact", "/contact.html"],
    ],
  },
  {
    id: "footer-legal",
    title: "Legal",
    links: [
      ["Privacy", "/privacy.html"],
      ["Terms", "/terms.html"],
    ],
  },
];
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
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    <a className={s.footerLink} href={href}>
                      {label}
                    </a>
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
