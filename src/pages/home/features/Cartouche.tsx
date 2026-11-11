import { useId } from 'react';
import type { Show } from '../../../components/AtlasMap/AtlasMap.tsx';
import type { atlasStats } from '../../../utils/atlasMarks';
import * as styles from '../HomePage.css';
import { m } from '../../../paraglide/messages.js';

const CAPTION: Record<Show, () => string> = {
  all: m.home_cap_all,
  set: m.home_cap_set,
  author: m.home_cap_author,
};

const COUNTRY_TOTAL = 195;

type CartoucheProps = {
  stats: ReturnType<typeof atlasStats>;
  show: Show;
  /** imagined worlds with books in them */
  worlds: number;
  /** goes up when a pinned book lands: the count ticks */
  tick: number;
};

const Cartouche = ({ stats, show, worlds, tick }: CartoucheProps) => {
  const tooltipId = useId();

  const countByShow: Record<Show, number> = {
    all: stats.countries,
    set: stats.set,
    author: stats.authors,
  };

  const count = countByShow[show];

  return (
    <div className={styles.cartouche}>
      <p className={styles.cartBig}>
        <b key={tick} className={tick ? styles.ticked : undefined}>
          {count}
        </b>
        <span
          className={styles.cartOf}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable so keyboard users can open the tooltip
          tabIndex={0}
          aria-describedby={tooltipId}
        >
          / {COUNTRY_TOTAL}
          <span className={styles.cartWhy} id={tooltipId} role="tooltip">
            {m.home_cart_why()}
          </span>
        </span>
      </p>
      <p className={styles.cartCap}>{CAPTION[show]()}</p>
      <p className={styles.cartMeta}>
        {m.count_book({ count: stats.books })} ·{' '}
        {m.count_continent({ count: stats.continents })}
        {worlds > 0 && ` · ${m.count_imagined_world({ count: worlds })}`}
      </p>
    </div>
  );
};

export default Cartouche;
