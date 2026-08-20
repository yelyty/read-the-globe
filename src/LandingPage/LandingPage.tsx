import { MapPinIcon } from "@phosphor-icons/react";
import * as s from "./LandingPage.css";
import { goals, steps } from "./config";
import LandingHeader from "./components/LandingHeader";
import Hero from "./components/Hero";
import WorldMap from "../WorldMap";
import { sampleCountries, samplePlaces } from "./sampleData";
import Divider from "../components/Divider/Divider";

const LandingPage = () => {
  const openSignup = () => {
    // wire to your sign-up modal / navigation
  };

  return (
    <div className={s.wrapper}>
      <LandingHeader />
      <Hero />

      <Divider />

      {/* How it works */}
      <section id="how" className={s.section}>
        <div className={s.sectionHead}>
          <span className={s.eyebrow}>How it works</span>
          <h2 className={s.sectionTitle}>Three steps from shelf to map</h2>
        </div>
        <div className={s.steps}>
          {steps.map((step) => (
            <div key={step.n} className={s.stepCard}>
              <div className={s.stepTop}>
                <span className={s.stepBadge}>{step.n}</span>
                <span className={s.stepEyebrow}>{step.eyebrow}</span>
              </div>
              <h3 className={s.stepTitle}>{step.title}</h3>
              <p className={s.cardText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Atlas */}
      <section id="features" className={s.atlasGrid}>
        <div className={s.atlasCard}>
          <span className={s.eyebrow}>The atlas</span>
          <h2 className={s.atlasTitle}>Your personal world map</h2>
          <p className={s.atlasBody}>
            Every book leaves two marks. Where its story is set, and where its
            author calls home. Read across both place and perspective as the
            world lights up.
          </p>

          <div className={s.mapPanel}>
            <WorldMap
              places={samplePlaces}
              onCountryClick={() => {}}
              countryData={sampleCountries}
            />
          </div>
        </div>
      </section>

      {/* Reading goals */}
      <section id="goals" className={s.goalsSection}>
        <div className={s.goalsCard}>
          <div>
            <span className={s.eyebrow}>Reading goals</span>
            <h2 className={s.goalsTitle}>
              Aim somewhere
              <br />
              you haven't read yet
            </h2>
            <div className={s.chips}>
              {["Region", "Countries", "Place", "Theme"].map((c) => (
                <span key={c} className={s.chip}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className={s.goalRows}>
            {goals.map((g) => (
              <div key={g.name} className={s.goalRow}>
                <div className={s.goalHead}>
                  <span className={s.goalIcon}>
                    <MapPinIcon size={16} weight="fill" />
                  </span>
                  <span className={s.goalName}>{g.name}</span>
                  <span className={s.goalCount}>
                    <span className={s.goalCountNum}>{g.done}</span> / {g.total}
                  </span>
                </div>
                <progress className={s.track} value={g.done / g.total} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <div className={s.ctaWrap}>
        <div className={s.cta}>
          <h2 className={s.ctaTitle}>The Globe is waiting for you.</h2>
          <p className={s.ctaText}>
            Start with the last book you loved. Pin it, and watch the world
            begin to fill in.
          </p>
          <button className={s.ctaBtn} onClick={openSignup}>
            <MapPinIcon size={18} weight="fill" /> Start your map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
