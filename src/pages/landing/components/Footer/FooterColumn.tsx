import { Link, type LinkProps } from '@tanstack/react-router';

import * as styles from './Footer.css';

type FooterLink = { label: () => string; to: LinkProps['to'] };

export type Column = {
  /** the heading's id, which names the nav */
  id: string;
  title: () => string;
  links: readonly FooterLink[];
};

// a column of the footer: its heading and its links
const FooterColumn = ({ column }: { column: Column }) => {
  const renderLink = (link: FooterLink) => (
    <li key={link.to}>
      <Link className={styles.footerLink} to={link.to}>
        {link.label()}
      </Link>
    </li>
  );

  return (
    <nav aria-labelledby={column.id}>
      <h2 className={styles.footerHead} id={column.id}>
        {column.title()}
      </h2>
      <ul className={styles.footerList}>{column.links.map(renderLink)}</ul>
    </nav>
  );
};

export default FooterColumn;
