import type { Show } from '../../components/AtlasMap/AtlasMap.tsx';
import * as styles from './HomePage.css';
import { m } from '../../paraglide/messages.js';

const SHOW: [Show, () => string, (() => string)?][] = [
  ['all', m.map_key_both],
  ['set', m.map_show_set],
  ['author', m.map_show_authors, m.map_show_authors_long],
];

type MapKeyProps = {
  show: Show;
  onShow: (show: Show) => void;
  canFilter: boolean;
};

// What the colours mean, and a filter once there is more than one book to filter.
const MapKey = ({ show, onShow, canFilter }: MapKeyProps) => (
  <div className={styles.legend}>
    <ul className={styles.key} aria-label={m.map_key()}>
      <li>
        <i className={styles.swatchSet} aria-hidden="true" />
        {m.map_key_set()}
      </li>
      <li>
        <i className={styles.swatchAuthor} aria-hidden="true" />
        {m.map_key_author()}
      </li>
      <li>
        <i className={styles.swatchBoth} aria-hidden="true" />
        {m.map_key_both()}
      </li>
    </ul>
    {canFilter && (
      <div
        className={styles.showGroup}
        role="group"
        aria-label={m.map_show_label()}
      >
        <span className={styles.capsLabel} aria-hidden="true">
          {m.map_show()}
        </span>
        {SHOW.map(([value, label, long]) => (
          <button
            key={value}
            type="button"
            className={styles.showBtn}
            aria-pressed={show === value}
            aria-label={long?.()}
            onClick={() => onShow(value)}
          >
            {label()}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default MapKey;
