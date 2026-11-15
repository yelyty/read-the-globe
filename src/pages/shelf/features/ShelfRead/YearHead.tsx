import { CaretDownIcon } from '@phosphor-icons/react';

import * as styles from '../../ShelfPage.css';

type YearHeadProps = {
  year: string;
  /** years only fold on the whole shelf; a search or filter shows every match */
  foldable: boolean;
  folded: boolean;
  /** a line about the year's reading, on the whole shelf */
  note?: string;
  onToggle: () => void;
};

// the heading over a year's books on the Shelf; on the whole shelf it folds the year away
const YearHead = ({
  year,
  foldable,
  folded,
  note,
  onToggle,
}: YearHeadProps) => (
  <li className={styles.yearHead}>
    <h2 className={styles.yearTitle}>
      {foldable ? (
        <button
          type="button"
          className={styles.yearToggle}
          aria-expanded={!folded}
          onClick={onToggle}
        >
          <CaretDownIcon aria-hidden="true" />
          {year}
        </button>
      ) : (
        year
      )}
    </h2>
    {foldable && note && <p>{note}</p>}
  </li>
);

export default YearHead;
