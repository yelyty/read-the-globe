import { Link, type LinkProps } from '@tanstack/react-router';

import * as styles from './Footer.css';

type FooterItemProps = { label: string } & (
  { to: LinkProps['to']; href?: never } | { href: string; to?: never }
);

// a footer link: to another page, or (href) to a section of the landing
const FooterItem = ({ label, to, href }: FooterItemProps) => (
  <li>
    {href ? (
      <a className={styles.footerLink} href={href}>
        {label}
      </a>
    ) : (
      <Link className={styles.footerLink} to={to}>
        {label}
      </Link>
    )}
  </li>
);

export default FooterItem;
