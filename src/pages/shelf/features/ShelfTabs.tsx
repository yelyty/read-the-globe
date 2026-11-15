import type { KeyboardEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { m } from '../../../paraglide/messages.js';
import * as styles from '../ShelfPage.css';

export type ShelfTab = 'read' | 'next';

type ShelfTabsProps = {
  tab: ShelfTab;
  readCount: number;
  nextCount: number;
};

// folder tabs: the open one is the page colour, so it joins the shelf below
const ShelfTabs = ({ tab, readCount, nextCount }: ShelfTabsProps) => {
  const navigate = useNavigate();

  const openTab = (to: ShelfTab) => {
    navigate({
      to: '/app/shelf',
      search: (prev) => ({ ...prev, tab: to === 'next' ? 'next' : undefined }),
      replace: true,
    });

    document.getElementById(`tab-${to}`)?.focus();
  };

  const handleTab = (to: ShelfTab) => () => openTab(to);

  // the arrow keys move between the two tabs
  const handleTabKey = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === 'ArrowRight' || keyEvent.key === 'ArrowLeft')
      openTab(tab === 'next' ? 'read' : 'next');
  };

  return (
    <div className={styles.tabs} role="tablist" aria-label={m.nav_shelf()}>
      <button
        type="button"
        role="tab"
        id="tab-read"
        className={styles.tab}
        aria-selected={tab === 'read'}
        aria-controls="shelf-read"
        tabIndex={tab === 'read' ? 0 : -1}
        onClick={handleTab('read')}
        onKeyDown={handleTabKey}
      >
        {m.shelf_tab_read()} <span className={styles.tabN}>{readCount}</span>
      </button>
      <button
        type="button"
        role="tab"
        id="tab-next"
        className={styles.tab}
        aria-selected={tab === 'next'}
        aria-controls="shelf-next"
        tabIndex={tab === 'next' ? 0 : -1}
        onClick={handleTab('next')}
        onKeyDown={handleTabKey}
      >
        {m.shelf_tab_next()} <span className={styles.tabN}>{nextCount}</span>
      </button>
    </div>
  );
};

export default ShelfTabs;
