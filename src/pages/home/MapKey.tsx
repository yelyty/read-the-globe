import type { Show } from '../../components/AtlasMap/AtlasMap.tsx';
import * as s from './HomePage.css';
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
  <div className={s.legend}>
    <ul className={s.key} aria-label={m.map_key()}>
      <li>
        <i className={s.swatchSet} aria-hidden="true" />
        {m.map_key_set()}
      </li>
      <li>
        <i className={s.swatchAuthor} aria-hidden="true" />
        {m.map_key_author()}
      </li>
      <li>
        <i className={s.swatchBoth} aria-hidden="true" />
        {m.map_key_both()}
      </li>
    </ul>
    {canFilter && (
      <div className={s.showGroup} role="group" aria-label={m.map_show_label()}>
        <span className={s.capsLabel} aria-hidden="true">
          {m.map_show()}
        </span>
        {SHOW.map(([value, label, long]) => (
          <button
            key={value}
            type="button"
            className={s.showBtn}
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
