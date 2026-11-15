import type { LinkProps } from '@tanstack/react-router';

import * as styles from './Footer.css';
import FooterItem from './FooterItem';

type FooterLink = { label: () => string; to: LinkProps['to'] };

export type Column = {
  /** the heading's id, which names the nav */
  id: string;
  title: () => string;
  links: readonly FooterLink[];
};

// a column of the footer: its heading and its links
const FooterColumn = ({ column }: { column: Column }) => {
  return (
    <nav aria-labelledby={column.id}>
      <h2 className={styles.footerHead} id={column.id}>
        {column.title()}
      </h2>
      <ul className={styles.footerList}>
        {column.links.map((link) => (
          <FooterItem key={link.to} to={link.to} label={link.label()} />
        ))}
      </ul>
    </nav>
  );
};

export default FooterColumn;
