import { useTheme } from '../../../../hooks/useTheme';
import * as styles from './Features.css';
import { m } from '../../../../paraglide/messages.js';

const PANELS = [
  {
    tone: 'green',
    shot: 'log',
    title: m.landing_panel_log_title,
    text: m.landing_panel_log_text,
    alt: m.landing_panel_log_alt,
  },
  {
    tone: 'clay',
    shot: 'goals',
    title: m.landing_panel_goals_title,
    text: m.landing_panel_goals_text,
    alt: m.landing_panel_goals_alt,
  },
  {
    tone: 'ochre',
    shot: 'shelf',
    title: m.landing_panel_shelf_title,
    text: m.landing_panel_shelf_text,
    alt: m.landing_panel_shelf_alt,
  },
] as const;

// Three colour panels that pile up as you scroll, each with the app's own screen (phone-sized on phones).
const Features = () => {
  const night = useTheme() === 'dark' ? '-night' : '';

  return (
    <section className={styles.band} id="features" aria-labelledby="band-h">
      <svg
        className={styles.wave}
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 72V44C180 6 420 -6 720 26s560 38 720 0v46Z"
          fill="currentColor"
        />
      </svg>
      <div className={styles.bandIn}>
        <h2 className={styles.title} id="band-h">
          {m.landing_band_title()}
        </h2>
        <p className={styles.sub}>{m.landing_band_sub()}</p>
        <div className={styles.panels}>
          {PANELS.map((panel) => (
            <article key={panel.shot} className={styles.panel[panel.tone]}>
              <div className={styles.panelText}>
                <h3>{panel.title()}</h3>
                <p>{panel.text()}</p>
              </div>
              <div className={styles.shot}>
                <picture>
                  <source
                    srcSet={`/landing/app-${panel.shot}-phone${night}.webp`}
                    media="(max-width: 799px)"
                  />
                  <img
                    src={`/landing/app-${panel.shot}-desktop${night}.webp`}
                    alt={panel.alt()}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
