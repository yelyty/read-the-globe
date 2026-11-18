import { useEffect, useState } from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';

import '../../App.css';
import { LandingContext, type Landing } from '../../hooks/useLanding';
import { m } from '../../paraglide/messages.js';
import LogBook from '../../features/LogBook/LogBook';
import AppHeader from '../AppHeader/AppHeader';
import AppFooter from '../AppFooter/AppFooter';
import StatusBar from '../StatusBar/StatusBar';
import * as styles from './AppLayout.css';
import LogPill from './LogPill';

const TITLES: Record<string, () => string> = {
  '/app': m.nav_home,
  '/app/shelf': m.nav_shelf,
  '/app/goals': m.nav_goals,
  '/app/account': m.nav_account,
  '/app/postcard': m.title_postcard,
};

/**
 * Shows the layout of the signed-in app: the header, the page, the footer, and Log a book.
 * It sets the title of the browser tab for each page, and keeps the book that was just pinned, for the map of Home.
 */
const AppLayout = () => {
  const landing = useState<Landing | null>(null);

  const path = useRouterState({
    select: (st) => st.location.pathname.replace(/\/$/, ''),
  });

  useEffect(() => {
    const was = document.title;

    document.title = m.title_page({ page: (TITLES[path] ?? m.nav_home)() });

    return () => {
      document.title = was;
    };
  }, [path]);

  return (
    <StatusBar>
      <LandingContext value={landing}>
        <div className={styles.shell}>
          <AppHeader />
          <main className={`wrapper ${styles.main}`}>
            <Outlet />
          </main>
          <AppFooter />
          <LogBook />
          <LogPill />
        </div>
      </LandingContext>
    </StatusBar>
  );
};

export default AppLayout;
