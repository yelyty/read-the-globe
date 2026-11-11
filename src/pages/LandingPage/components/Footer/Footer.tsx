import { Link } from '@tanstack/react-router';
import Logo from '../../../../components/Logo/Logo';
import { SECTIONS } from '../../sections';
import * as s from './Footer.css';

const COLUMNS = [
  {
    id: 'footer-company',
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Journal', to: '/journal' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    id: 'footer-legal',
    title: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
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
              aria-label="Read The Globe, back to the top"
            >
              <Logo className={s.logo} />
              <span className={s.logoTitle}>Read The Globe</span>
            </a>
            <p className={s.footerTag}>Read the world, one book at a time.</p>
          </div>
          <nav aria-labelledby="footer-product">
            <h2 className={s.footerHead} id="footer-product">
              Product
            </h2>
            <ul className={s.footerList}>
              {SECTIONS.map((section) => (
                <li key={section.hash}>
                  <a className={s.footerLink} href={`/#${section.hash}`}>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {COLUMNS.map((column) => (
            <nav key={column.id} aria-labelledby={column.id}>
              <h2 className={s.footerHead} id={column.id}>
                {column.title}
              </h2>
              <ul className={s.footerList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link className={s.footerLink} to={link.to}>
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
