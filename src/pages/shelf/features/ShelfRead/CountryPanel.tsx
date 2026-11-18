import { BooksIcon, PushPinIcon } from '@phosphor-icons/react';

import { markOf, type Mark } from '../../../../utils/atlasMarks';
import { CONTINENT_OF, continentName } from '../../../../utils/continents';
import { m } from '../../../../paraglide/messages.js';
import ButtonLink from '../../../../components/Button/ButtonLink';
import MarkDot from '../../../../components/MarkDot/MarkDot';
import HatchPattern from '../../../../components/HatchPattern/HatchPattern';
import * as styles from '../../ShelfPage.css';
import { hatchSize } from './hatch';
import { useCountryStamp } from './useCountryStamp';

type CountryPanelProps = {
  code: string;
  name: string;
  /** the books that marked it */
  mark: Mark;
};

/**
 * Shows the shelf of one country (?country=): its outline in its marks, why it is on the atlas, and the links to go on.
 */
const CountryPanel = ({ code, name, mark }: CountryPanelProps) => {
  const stamp = useCountryStamp(code);
  const continent = CONTINENT_OF[code];

  return (
    <section className={styles.country} aria-labelledby="shelf-country-name">
      <div className={styles.countryMap}>
        {stamp && (
          <svg viewBox={stamp.viewBox} aria-hidden="true" focusable="false">
            <defs>
              {/* both marks: the olive and rust hatch, a 3px stripe at the drawn size */}
              <HatchPattern id="shelf-hatch" size={hatchSize(stamp.width)} />
            </defs>
            <path
              d={stamp.d}
              className={styles.shape}
              data-mark={markOf(mark)}
            />
          </svg>
        )}
      </div>
      <div>
        <h2 className={styles.countryName} id="shelf-country-name">
          {name}
        </h2>
        {continent && (
          <p className={styles.countryMeta}>{continentName(continent)}</p>
        )}
        <p className={styles.countryWhy}>
          {mark.set.length > 0 && (
            <span>
              <MarkDot kind="set" />
              {m.shelf_set_here({
                stories: m.count_story({ count: mark.set.length }),
              })}
            </span>
          )}
          {mark.author.length > 0 && (
            <span>
              <MarkDot kind="author" />
              {m.shelf_from_here({
                authors: m.count_author({ count: mark.author.length }),
              })}
            </span>
          )}
        </p>
        <div className={styles.countryActions}>
          <ButtonLink
            variant="link"
            underline
            to="."
            search={(prev) => ({ ...prev, log: true, country: code })}
          >
            <PushPinIcon aria-hidden="true" />
            {m.shelf_log_another()}
          </ButtonLink>
          <ButtonLink variant="link" underline to="/app/shelf">
            <BooksIcon aria-hidden="true" />
            {m.shelf_whole()}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default CountryPanel;
