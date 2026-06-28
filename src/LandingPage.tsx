import { BooksIcon, MapPinAreaIcon } from "@phosphor-icons/react";
import Header from "./Header";
import { sampleCountries, samplePlaces } from "./sampleData";
import WorldMap from "./WorldMap";
import { TargetIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

const LandingPage = () => {
  return (
    <div className="wrapper">
      <Header authorized={false} />
      <section className="hero">
        <div className="hero-text">
          <p className="kick">A reading atlas</p>
          <h1 className="head">Map every book you’ve ever read.</h1>
          <p className="sub">
            Track what you read and watch your library spread across the globe.
            Mark where its authors are from and where their stories are set.
          </p>
          <a className="sample" href="/sample">
            See a sample globe →
          </a>
        </div>

        <div className="mapframe">
          <WorldMap
            countryData={sampleCountries}
            onCountryClick={() => {}}
            places={samplePlaces}
          />
        </div>
      </section>
      <section id="features" className="band">
        <Feature title="Two maps, one library" icon={<MapPinAreaIcon />}>
          See where your authors come from and where their stories travel — two
          views of the same shelf.
        </Feature>
        <Feature title="Read around the world" icon={<TargetIcon />}>
          Set a yearly goal and a countries-explored goal, and watch the blank
          spaces fill in.
        </Feature>
        <Feature title="Dated &amp; rated" icon={<BooksIcon />}>
          Every finished book, with its place, your rating, and the date — a
          journal you can revisit.
        </Feature>
      </section>
    </div>
  );
};

const Feature = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="feature">
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
};

export default LandingPage;
