import { Link } from '@tanstack/react-router';
import * as styles from './AppFooter.css';
import { m } from '../../paraglide/messages.js';

const LINKS = [
  { label: m.footer_about, to: '/about' },
  { label: m.footer_journal, to: '/journal' },
  { label: m.footer_contact, to: '/contact' },
  { label: m.footer_privacy, to: '/privacy' },
  { label: m.footer_terms, to: '/terms' },
] as const;

const AppFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <p>{m.footer_copyright({ year: 2026 })}</p>
        <nav className={styles.links} aria-label={m.footer_nav()}>
          {LINKS.map((link) => (
            <Link key={link.to} className={styles.link} to={link.to}>
              {link.label()}
            </Link>
          ))}
        </nav>
        <p className={styles.credit}>
          {m.footer_map_before()}{' '}
          <a
            className={styles.link}
            href="https://www.naturalearthdata.com/"
            rel="noopener"
          >
            Natural Earth
          </a>
          {m.footer_map_after()}
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
