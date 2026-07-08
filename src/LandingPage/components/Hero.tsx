import { CheckIcon } from "@phosphor-icons/react";
import { bullets } from "../config";
import * as s from "../LandingPage.css";
import WorldMap from "../../WorldMap";
import { samplePlaces, sampleCountries } from "../sampleData";

const Hero = () => {
  return (
    <section className={s.hero}>
      <div className={s.heroText}>
        <span className={s.kicker}>A reading atlas</span>
        <h1 className={s.head}>
          Read the Globe,
          <br />
          one book at a time.
        </h1>
        <p className={s.sub}>
          Read The Globe turns every novel into a pin on your own atlas. Log
          what you've read, mark where its story is set and where its author is
          from, set goals and watch the Globe slowly fill in.
        </p>
        <ul className={s.checklist}>
          {bullets.map((b) => (
            <li key={b} className={s.checkItem}>
              <span className={s.checkIcon}>
                <CheckIcon size={13} weight="bold" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className={s.heroMap}>
        <div className={s.mapWrapper}>
          <WorldMap
            countryData={sampleCountries}
            places={samplePlaces}
            onCountryClick={() => {}}
          />
        </div>
      </div>
    </section>
  );
};
export default Hero;
