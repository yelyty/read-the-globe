import type { Marks } from '../../../../utils/atlasMarks';
import { continentName, type Continent } from '../../../../utils/continents';
import { m } from '../../../../paraglide/messages.js';
import * as styles from '../../HomePage.css';
import CountryShape from './CountryShape';
import CountryStamp from './CountryStamp';

// the shapes shown in a folded row before "+N"
const PEEK = 6;

type ContinentRowProps = {
  continent: Continent;
  /** its countries, in name order */
  codes: string[];
  marks: Marks;
  name: (code: string) => string;
  /** the continent with the most countries starts unfolded */
  open: boolean;
  onFocusCountry?: (code: string, el: Element | null) => void;
};

/**
 * Shows a continent under the map. When it is closed, it shows some of its shapes. When it is open, it shows its country stamps.
 * @param codes - The countries, sorted by name.
 * @param open - If true, the continent starts open.
 */
const ContinentRow = ({
  continent,
  codes,
  marks,
  name,
  open,
  onFocusCountry,
}: ContinentRowProps) => {
  return (
    <details className={styles.ccRow} open={open}>
      <summary className={styles.ccSummary}>
        <h3 className={styles.ccTitle}>
          {continentName(continent)}{' '}
          <span className={styles.ccN} aria-hidden="true">
            {codes.length}
          </span>
          <span className={styles.srOnly}>
            , {m.count_country({ count: codes.length })}
          </span>
        </h3>
        <span className={styles.ccPeek} aria-hidden="true">
          {codes.slice(0, PEEK).map((code) => (
            <CountryShape
              key={code}
              code={code}
              mark={marks[code]}
              width={56}
              height={35}
            />
          ))}
          {codes.length > PEEK && (
            <span className={styles.ccMore}>+{codes.length - PEEK}</span>
          )}
        </span>
      </summary>
      <ul className={styles.ccStamps}>
        {codes.map((code) => (
          <CountryStamp
            key={code}
            code={code}
            name={name(code)}
            mark={marks[code]}
            onFocusCountry={onFocusCountry}
          />
        ))}
      </ul>
    </details>
  );
};

export default ContinentRow;
