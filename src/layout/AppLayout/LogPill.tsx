import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PushPinIcon } from '@phosphor-icons/react';

import { m } from '../../paraglide/messages.js';
import * as styles from './AppLayout.css';

// scroll moves smaller than this are jitter, not a direction
const SCROLL_JITTER = 6;
// this close to the bottom of the page counts as the end
const END_SLACK = 8;
// near the top the pill always stays
const TOP_ZONE = 120;

// phones: the floating Log a book pill steps aside while the reader scrolls down, so it never sits on the row
// being read, and comes back on the way up or at the end of the page
const LogPill = () => {
  const [away, setAway] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastY;

      if (Math.abs(dy) < SCROLL_JITTER) return;
      lastY = currentY;

      const atEnd =
        window.innerHeight + currentY >=
        document.documentElement.scrollHeight - END_SLACK;

      setAway(dy > 0 && currentY > TOP_ZONE && !atEnd);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Link
      className={styles.pill}
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

export default LogPill;
