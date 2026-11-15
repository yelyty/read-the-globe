import Logo from '../../../../components/Logo/Logo';
import LanguagePicker from '../../../../components/LanguagePicker/LanguagePicker';
import { m } from '../../../../paraglide/messages.js';
import { SECTIONS } from '../../utils/sections';
import * as styles from './Footer.css';
import FooterColumn from './FooterColumn';
import FooterItem from './FooterItem';

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
            {/* the landing's own sections, as links back to them */}
            <ul className={styles.footerList}>
              {SECTIONS.map((section) => (
                <FooterItem
                  key={section.hash}
                  href={`/#${section.hash}`}
                  label={section.label()}
                />
              ))}
            </ul>
          </nav>
          {COLUMNS.map((column) => (
            <FooterColumn key={column.id} column={column} />
          ))}
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
