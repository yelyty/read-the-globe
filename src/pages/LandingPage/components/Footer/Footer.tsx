import { Link } from '@tanstack/react-router';
import Logo from '../../../../components/Logo/Logo';
import { SECTIONS } from '../../sections';
import LanguagePicker from '../../../../components/LanguagePicker/LanguagePicker';
import { footSelect } from '../../../../components/LanguagePicker/LanguagePicker.css';
import { m } from '../../../../paraglide/messages.js';
import * as s from './Footer.css';

const COLUMNS = [
  {
    id: 'footer-company',
    title: m.footer_company,
    links: [
      { label: m.footer_about, to: '/about' },
      { label: m.footer_journal, to: '/journal' },
      { label: m.footer_contact, to: '/contact' },
    ],
  },
  {
    id: 'footer-legal',
    title: m.footer_legal,
    links: [
      { label: m.footer_privacy, to: '/privacy' },
      { label: m.footer_terms, to: '/terms' },
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
              href="/#top"
              className={s.logoLink}
              aria-label={m.footer_to_top()}
            >
              <Logo className={s.logo} />
              <span className={s.logoTitle}>Read The Globe</span>
            </a>
            <p className={s.footerTag}>{m.footer_tag()}</p>
          </div>
          <nav aria-labelledby="footer-product">
            <h2 className={s.footerHead} id="footer-product">
              {m.footer_product()}
            </h2>
            <ul className={s.footerList}>
              {SECTIONS.map((section) => (
                <li key={section.hash}>
                  <a className={s.footerLink} href={`/#${section.hash}`}>
                    {section.label()}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {COLUMNS.map((column) => (
            <nav key={column.id} aria-labelledby={column.id}>
              <h2 className={s.footerHead} id={column.id}>
                {column.title()}
              </h2>
              <ul className={s.footerList}>
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link className={s.footerLink} to={link.to}>
                      {link.label()}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={s.footerTail}>
          <span>{m.footer_copyright({ year: 2026 })}</span>
          <LanguagePicker selectClassName={footSelect} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
