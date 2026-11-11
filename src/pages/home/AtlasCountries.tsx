import { Link } from '@tanstack/react-router';
import { MapTrifoldIcon } from '@phosphor-icons/react';
import { counted, type Mark, type Marks } from '../../utils/atlasMarks';
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  continentName,
  type Continent,
} from '../../utils/continents';

import * as s from './HomePage.css';
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
    (c) => byContinent[c]
  );
  const biggest = continents.reduce<Continent | undefined>(
    (a, c) => (!a || byContinent[c]!.length > byContinent[a]!.length ? c : a),
    undefined
  );

  return (
    <section className={s.section} aria-labelledby="countries-title">
      <div className={s.subHead}>
        <h2 id="countries-title" className={s.h2}>
          <MapTrifoldIcon className={s.h2Icon} aria-hidden="true" />
          {m.home_countries_title()}
        </h2>
        <p className={s.subNote}>{m.home_countries_note()}</p>
      </div>
      <div className={s.cc} data-tips>
        {continents.map((continent) => {
          const codes = byContinent[continent]!.sort((a, b) =>
            name(a).localeCompare(name(b), getLocale())
          );
          return (
            <details
              key={continent}
              className={s.ccRow}
              open={continent === biggest}
            >
              <summary className={s.ccSummary}>
                <h3 className={s.ccTitle}>
                  {continentName(continent)}{' '}
                  <span className={s.ccN} aria-hidden="true">
                    {codes.length}
                  </span>
                  <span className={s.srOnly}>
                    , {m.count_country({ count: codes.length })}
                  </span>
                </h3>
                <span className={s.ccPeek} aria-hidden="true">
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
                    <span className={s.ccMore}>+{codes.length - PEEK}</span>
                  )}
                </span>
              </summary>
              <ul className={s.ccStamps}>
                {codes.map((code) => (
                  <li key={code}>
                    <Link
                      className={s.ccStamp}
                      to="/app/shelf"
                      search={{ country: code }}
                      onFocus={(e) =>
                        e.currentTarget.matches(':focus-visible') &&
                        onFocusCountry?.(code, e.currentTarget)
                      }
                      onBlur={() => onFocusCountry?.(code, null)}
                    >
                      <span className={s.ccShape}>
                        <CountryShape
                          code={code}
                          mark={marks[code]}
                          width={128}
                          height={80}
                        />
                      </span>
                      <span className={s.ccName}>{name(code)}</span>
                      <span className={s.ccWhat}>{describe(marks[code])}</span>
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
