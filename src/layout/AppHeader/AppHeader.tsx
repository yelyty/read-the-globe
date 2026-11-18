import { Link } from '@tanstack/react-router';
import { PushPinIcon } from '@phosphor-icons/react';

import * as headerStyles from '../../pages/landing/features/Header/Header.css';
import { m } from '../../paraglide/messages.js';
import ThemeButton from '../../components/ThemeButton/ThemeButton';
import Logo from '../../components/Logo/Logo';
import BetaChip from '../../components/BetaChip/BetaChip';
import AccountMenu from '../AccountMenu/AccountMenu';
import * as styles from './AppHeader.css';

/**
 * Shows the header of the app: the logo, the navigation, and the account menu.
 */
const AppHeader = () => {
  return (
    <header className={headerStyles.header}>
      <div className={styles.row}>
        <Link
          to="/app"
          className={headerStyles.brand}
          aria-label={m.brand_home()}
        >
          <Logo className={headerStyles.logo} />
          <span className={headerStyles.brandWord}>Read The Globe</span>
          <BetaChip className={headerStyles.brandChip} />
        </Link>

        <nav className={styles.nav} aria-label={m.nav_main()}>
          <Link
            className={styles.navLink}
            to="/app"
            activeOptions={{ exact: true, includeSearch: false }}
          >
            {m.nav_home()}
          </Link>
          <Link className={styles.navLink} to="/app/shelf">
            {m.nav_shelf()}
          </Link>
          <Link className={styles.navLink} to="/app/goals">
            {m.nav_goals()}
          </Link>
          <Link className={styles.navLink} to="/app/postcard">
            {m.nav_postcard()}
          </Link>
          <AccountMenu />
        </nav>
        <div className={styles.tools}>
          <ThemeButton />
          <Link
            className={`${headerStyles.start} ${styles.logBtn}`}
            data-log-toggle
            to="."
            search={(prev) => ({ ...prev, log: true })}
          >
            <PushPinIcon weight="fill" aria-hidden="true" />
            <span>{m.log_a_book()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
