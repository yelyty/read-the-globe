import type { Show } from "../../components/AtlasMap/AtlasMap.tsx";
import * as s from "./HomePage.css";

const SHOW: [Show, string, string?][] = [
  ["all", "Both"],
  ["set", "Where set"],
  ["author", "Authors", "Authors: where authors are from"],
];

type MapKeyProps = {
  show: Show;
  onShow: (show: Show) => void;
  canFilter: boolean;
};

// What the colours mean, and a filter once there is more than one book to filter.
const MapKey = ({ show, onShow, canFilter }: MapKeyProps) => (
  <div className={s.legend}>
    <ul className={s.key} aria-label="Key">
      <li>
        <i className={s.swatchSet} aria-hidden="true" />
        Story set here
      </li>
      <li>
        <i className={s.swatchAuthor} aria-hidden="true" />
        Author from here
      </li>
      <li>
        <i className={s.swatchBoth} aria-hidden="true" />
        Both
      </li>
    </ul>
    {canFilter && (
      <div className={s.showGroup} role="group" aria-label="Show on the map">
        <span className={s.capsLabel} aria-hidden="true">
          Show
        </span>
        {SHOW.map(([value, label, long]) => (
          <button
            key={value}
            type="button"
            className={s.showBtn}
            aria-pressed={show === value}
            aria-label={long}
            onClick={() => onShow(value)}
          >
            {label}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default MapKey;
