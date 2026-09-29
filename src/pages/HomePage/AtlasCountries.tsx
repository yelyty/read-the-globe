import { Link } from "@tanstack/react-router";
import type { Marks } from "../../utils/atlasMarks";
import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  type Continent,
} from "../../utils/continents";
import * as s from "./HomePage.css";

type AtlasCountriesProps = { marks: Marks; names: Record<string, string> };

const AtlasCountries = ({ marks, names }: AtlasCountriesProps) => {
  const byContinent: Partial<Record<Continent, string[]>> = {};
  for (const code of Object.keys(marks))
    (byContinent[CONTINENT_OF[code]] ??= []).push(code);
  const name = (code: string) => names[code] ?? code;

  return (
    <section className={s.section} aria-labelledby="countries-title">
      <div className={s.subHead}>
        <h2 id="countries-title" className={s.h2}>
          Countries on your atlas
        </h2>
        <p className={s.subNote}>
          Open a continent, then choose a country to see its books.
        </p>
      </div>
      {(Object.keys(CONTINENT_NAMES) as Continent[])
        .filter((c) => byContinent[c])
        .map((continent) => {
          const codes = byContinent[continent]!.sort((a, b) =>
            name(a).localeCompare(name(b)),
          );
          return (
            <details key={continent} className={s.cc}>
              <summary className={s.ccSummary}>
                <h3 className={s.ccTitle}>
                  {CONTINENT_NAMES[continent]}{" "}
                  <span aria-hidden="true">{codes.length}</span>
                  <span className={s.srOnly}>
                    , {codes.length}{" "}
                    {codes.length === 1 ? "country" : "countries"}
                  </span>
                </h3>
              </summary>
              <ul className={s.ccList}>
                {codes.map((code) => {
                  const { set, author } = marks[code];
                  const kind =
                    set.length && author.length
                      ? s.ccBoth
                      : set.length
                        ? s.ccSet
                        : s.ccAuthor;
                  const words = [
                    set.length && "story set here",
                    author.length && "author from here",
                  ]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <li key={code}>
                      <Link
                        className={kind}
                        to="/app/shelf"
                        search={{ country: code }}
                      >
                        {name(code)}
                        <span className={s.srOnly}>: {words}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
    </section>
  );
};

export default AtlasCountries;
