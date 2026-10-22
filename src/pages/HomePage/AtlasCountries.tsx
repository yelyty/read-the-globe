import { Link } from "@tanstack/react-router";
import { MapTrifoldIcon } from "@phosphor-icons/react";
import type { Mark, Marks } from "../../utils/atlasMarks";
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  type Continent,
} from "../../utils/continents";

import * as s from "./HomePage.css";
import CountryShape from "./CountryShape";

const PEEK = 6;
const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;
const describe = ({ set, author }: Mark) =>
  [
    set.length && `${plural(set.length, "story", "stories")} set here`,
    author.length && `${plural(author.length, "author", "authors")} from here`,
  ]
    .filter(Boolean)
    .join(", ");

type AtlasCountriesProps = { marks: Marks; names: Record<string, string> };

// Countries by continent, folded: a folded continent peeks at its first shapes, an open one
// shows each country as a stamp in its mark from the map. The biggest continent starts open.
const AtlasCountries = ({ marks, names }: AtlasCountriesProps) => {
  const byContinent: Partial<Record<Continent, string[]>> = {};
  for (const code of Object.keys(marks))
    (byContinent[CONTINENT_OF[code]] ??= []).push(code);
  const name = (code: string) => names[code] ?? code;
  const continents = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
    (c) => byContinent[c],
  );
  const biggest = continents.reduce<Continent | undefined>(
    (a, c) => (!a || byContinent[c]!.length > byContinent[a]!.length ? c : a),
    undefined,
  );

  return (
    <section className={s.section} aria-labelledby="countries-title">
      <div className={s.subHead}>
        <h2 id="countries-title" className={s.h2}>
          <MapTrifoldIcon className={s.h2Icon} aria-hidden="true" />
          Countries on your atlas
        </h2>
        <p className={s.subNote}>
          Open a continent, then choose a country to see its books.
        </p>
      </div>
      <div className={s.cc}>
        {continents.map((continent) => {
          const codes = byContinent[continent]!.sort((a, b) =>
            name(a).localeCompare(name(b)),
          );
          return (
            <details
              key={continent}
              className={s.ccRow}
              open={continent === biggest}
            >
              <summary className={s.ccSummary}>
                <h3 className={s.ccTitle}>
                  {CONTINENT_NAMES[continent]}{" "}
                  <span className={s.ccN} aria-hidden="true">
                    {codes.length}
                  </span>
                  <span className={s.srOnly}>
                    , {plural(codes.length, "country", "countries")}
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
