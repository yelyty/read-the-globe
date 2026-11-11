import { Link } from '@tanstack/react-router';
import { PushPinIcon } from '@phosphor-icons/react';
import * as h from '../../pages/LandingPage/components/Header/Header.css';
import * as s from './AppHeader.css';
import ThemeButton from '../ThemeButton/ThemeButton';
import Logo from '../Logo/Logo';
import AccountMenu from '../AccountMenu/AccountMenu';
import { m } from '../../paraglide/messages.js';

const AppHeader = () => {
  return (
    <header className={h.header}>
      <div className={s.row}>
        <Link to="/app" className={h.brand} aria-label={m.brand_home()}>
          <Logo className={h.logo} />
          <span className={h.brandWord}>Read The Globe</span>
        </Link>

        <nav className={s.nav} aria-label={m.nav_main()}>
          <Link
            className={s.navLink}
            to="/app"
            activeOptions={{ exact: true, includeSearch: false }}
          >
            {m.nav_home()}
          </Link>
          <Link className={s.navLink} to="/app/shelf">
            {m.nav_shelf()}
          </Link>
          <Link className={s.navLink} to="/app/goals">
            {m.nav_goals()}
          </Link>
          <Link className={s.navLink} to="/app/postcard">
            {m.nav_postcard()}
          </Link>
          <AccountMenu />
        </nav>
        <div className={s.tools}>
          <ThemeButton />
          <Link
            className={`${h.start} ${s.logBtn}`}
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
