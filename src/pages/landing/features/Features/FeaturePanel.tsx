import * as styles from './Features.css';

export type Panel = {
  tone: keyof typeof styles.panel;
  /** the screenshot's name: /landing/app-<shot>-<phone|desktop>[-night].webp */
  shot: string;
  title: () => string;
  text: () => string;
  alt: () => string;
};

type FeaturePanelProps = {
  panel: Panel;
  /** '-night' in the dark theme, so the screenshot matches */
  night: string;
};

/**
 * Shows one color panel: what the app does, beside a screenshot of the app. On a phone, the screenshot is of the phone.
 * @param night - '-night' for the dark theme screenshots, or an empty string.
 */
const FeaturePanel = ({ panel, night }: FeaturePanelProps) => (
  <article className={styles.panel[panel.tone]}>
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
);

export default FeaturePanel;
