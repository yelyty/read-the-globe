import type { Show } from '../../components/AtlasMap/AtlasMap.tsx';
import { m } from '../../paraglide/messages.js';
import ToggleGroup from '../../components/ToggleGroup/ToggleGroup';
import * as styles from './HomePage.css';

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
const MapKey = ({ show, onShow, canFilter }: MapKeyProps) => {
  const showOption = ([value, label, long]: (typeof SHOW)[number]) => ({
    value,
    content: label(),
    ariaLabel: long?.(),
  });

  const showOptions = SHOW.map(showOption);

  return (
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
        <ToggleGroup
          className={styles.showGroup}
          optionClassName={styles.showBtn}
          label={m.map_show_label()}
          value={show}
          options={showOptions}
          onChange={onShow}
        >
          <span className={styles.capsLabel} aria-hidden="true">
            {m.map_show()}
          </span>
        </ToggleGroup>
      )}
    </div>
  );
};

export default MapKey;
