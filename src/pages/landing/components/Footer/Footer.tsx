import Logo from '../../../../components/Logo/Logo';
import LanguagePicker from '../../../../components/LanguagePicker/LanguagePicker';
import { m } from '../../../../paraglide/messages.js';
import { SECTIONS } from '../../sections';
import * as styles from './Footer.css';
import FooterColumn, { type Column } from './FooterColumn';

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
  // the landing's own sections, as links back to them
  const renderSection = (section: (typeof SECTIONS)[number]) => (
    <li key={section.hash}>
      <a className={styles.footerLink} href={`/#${section.hash}`}>
        {section.label()}
      </a>
    </li>
  );

  const renderColumn = (column: Column) => (
    <FooterColumn key={column.id} column={column} />
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.footerGrid}>
          <div>
            <a
              href="/#top"
              className={styles.logoLink}
              aria-label={m.footer_to_top()}
            >
              <Logo className={styles.logo} />
              <span className={styles.logoTitle}>Read The Globe</span>
            </a>
            <p className={styles.footerTag}>{m.footer_tag()}</p>
          </div>
          <nav aria-labelledby="footer-product">
            <h2 className={styles.footerHead} id="footer-product">
              {m.footer_product()}
            </h2>
            <ul className={styles.footerList}>{SECTIONS.map(renderSection)}</ul>
          </nav>
          {COLUMNS.map(renderColumn)}
        </div>
        <div className={styles.footerTail}>
          <span>{m.footer_copyright({ year: 2026 })}</span>
          <LanguagePicker variant="footer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
