import { MapTrifoldIcon } from '@phosphor-icons/react';

import { counted, type Marks } from '../../utils/atlasMarks';
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  type Continent,
} from '../../utils/continents';
import { m } from '../../paraglide/messages.js';
import { getLocale } from '../../paraglide/runtime.js';
import * as styles from './HomePage.css';
import ContinentRow from './ContinentRow';

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

  // its countries in name order, under each continent that has any
  const rows = continents.map((continent) => ({
    continent,
    codes: byContinent[continent]!.sort((first, second) =>
      name(first).localeCompare(name(second), getLocale())
    ),
  }));

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
        {rows.map(({ continent, codes }) => (
          <ContinentRow
            key={continent}
            continent={continent}
            codes={codes}
            marks={marks}
            name={name}
            open={continent === biggest}
            onFocusCountry={onFocusCountry}
          />
        ))}
      </div>
    </section>
  );
};

export default AtlasCountries;
