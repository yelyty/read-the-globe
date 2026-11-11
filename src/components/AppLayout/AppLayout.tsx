import { useEffect, useState } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { PushPinIcon } from '@phosphor-icons/react';

import '../../App.css';

import AppHeader from '../AppHeader/AppHeader';
import AppFooter from '../AppFooter/AppFooter';
import StatusBar from '../StatusBar/StatusBar';
import { LandingContext, type Landing } from '../../hooks/useLanding';

import * as s from './AppLayout.css';
import LogBook from '../LogBook/LogBook';
import { m } from '../../paraglide/messages.js';

const TITLES: Record<string, () => string> = {
  '/app': m.nav_home,
  '/app/shelf': m.nav_shelf,
  '/app/goals': m.nav_goals,
  '/app/account': m.nav_account,
  '/app/postcard': m.title_postcard,
};

// phones: the floating Log a book pill steps aside while the reader scrolls down, so it never sits on the row
// being read, and comes back on the way up or at the end of the page
const LogPill = () => {
  const [away, setAway] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;

      if (Math.abs(dy) < 6) return;
      lastY = y;

      const atEnd =
        window.innerHeight + y >= document.documentElement.scrollHeight - 8;

      setAway(dy > 0 && y > 120 && !atEnd);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Link
      className={s.pill}
      data-away={away || undefined}
      data-log-toggle // the pinned book's pin leaves from here
      to="."
      search={(prev) => ({ ...prev, log: true })}
    >
      <PushPinIcon weight="fill" aria-hidden="true" />
      <span>{m.log_a_book()}</span>
    </Link>
  );
};

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
        <div className={s.shell}>
          <AppHeader />
          <main className={`wrapper ${s.main}`}>
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
