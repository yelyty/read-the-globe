import { Link, type LinkProps } from '@tanstack/react-router';

import * as styles from './Footer.css';

type FooterItemProps = { label: string } & (
  { to: LinkProps['to']; href?: never } | { href: string; to?: never }
);

/**
 * Shows a link of the footer.
 * @param to - A page of the app.
 * @param href - A section of the landing. If it is set, it is used in place of `to`.
 */
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
