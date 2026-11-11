import { Link } from '@tanstack/react-router';
import { MapTrifoldIcon } from '@phosphor-icons/react';
import { counted, type Mark, type Marks } from '../../utils/atlasMarks';
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  continentName,
  type Continent,
} from '../../utils/continents';

import * as styles from './HomePage.css';
import CountryShape from './CountryShape';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';

const PEEK = 6;

const describe = ({ set, author }: Mark) =>
  [
    set.length &&
      m.home_n_set({ stories: m.count_story({ count: set.length }) }),
    author.length &&
      m.home_n_from({ authors: m.count_author({ count: author.length }) }),
  ]
    .filter(Boolean)
    .join(', ');

type AtlasCountriesProps = {
  marks: Marks;
  names: Record<string, string>;
  /** a chip reached from the keyboard shows the map's tip for its country; null when it goes */
  onFocusCountry?: (code: string, el: Element | null) => void;
};

const AtlasCountries = ({
  marks,
  names,
  onFocusCountry,
}: AtlasCountriesProps) => {
  const byContinent: Partial<Record<Continent, string[]>> = {};

  // a territory's own shape counts under its country, so it isn't listed
  for (const code of counted(marks))
    (byContinent[CONTINENT_OF[code]] ??= []).push(code);
  const name = (code: string) => names[code] ?? code;

  const continents = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
    (continent) => byContinent[continent]
  );

  const biggest = continents.reduce<Continent | undefined>(
    (most, continent) =>
      !most || byContinent[continent]!.length > byContinent[most]!.length
        ? continent
        : most,
    undefined
  );

  return (
    <section className={styles.section} aria-labelledby="countries-title">
      <div className={styles.subHead}>
        <h2 id="countries-title" className={styles.h2}>
          <MapTrifoldIcon className={styles.h2Icon} aria-hidden="true" />
          {m.home_countries_title()}
        </h2>
        <p className={styles.subNote}>{m.home_countries_note()}</p>
      </div>
      <div className={styles.cc} data-tips>
        {continents.map((continent) => {
          const codes = byContinent[continent]!.sort((first, second) =>
            name(first).localeCompare(name(second), getLocale())
          );

          return (
            <details
              key={continent}
              className={styles.ccRow}
              open={continent === biggest}
            >
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
                    <span className={styles.ccMore}>
                      +{codes.length - PEEK}
                    </span>
                  )}
                </span>
              </summary>
              <ul className={styles.ccStamps}>
                {codes.map((code) => (
                  <li key={code}>
                    <Link
                      className={styles.ccStamp}
                      to="/app/shelf"
                      search={{ country: code }}
                      onFocus={(focusEvent) =>
                        focusEvent.currentTarget.matches(':focus-visible') &&
                        onFocusCountry?.(code, focusEvent.currentTarget)
                      }
                      onBlur={() => onFocusCountry?.(code, null)}
                    >
                      <span className={styles.ccShape}>
                        <CountryShape
                          code={code}
                          mark={marks[code]}
                          width={128}
                          height={80}
                        />
                      </span>
                      <span className={styles.ccName}>{name(code)}</span>
                      <span className={styles.ccWhat}>
                        {describe(marks[code])}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </section>
  );
};

export default AtlasCountries;
