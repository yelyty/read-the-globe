import { useState } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import { srOnly } from '../../../../styles/global.css';
import * as styles from './Share.css';
import { m } from '../../../../paraglide/messages.js';

const KINDS = [
  {
    id: 'authors',
    name: m.landing_share_authors,
    detail: m.landing_share_authors_detail,
    alt: m.landing_share_authors_alt,
  },
  {
    id: 'settings',
    name: m.landing_share_settings,
    detail: m.landing_share_settings_detail,
    alt: m.landing_share_settings_alt,
  },
  {
    id: 'year',
    name: m.landing_share_year,
    detail: m.landing_share_year_detail,
    alt: m.landing_share_year_alt,
  },
] as const;

// The kinds of postcard on the left; the app's card for the chosen kind on the right (always the day cards).
const Share = ({ onSignUp }: { onSignUp: () => void }) => {
  const [kind, setKind] = useState<string>(KINDS[0].id);
  // screen readers hear which card now shows; empty until the reader picks
  const [live, setLive] = useState('');

  return (
    <section className={styles.share} id="share" aria-labelledby="share-h">
      <div>
        <h2 className={styles.title} id="share-h">
          {m.landing_share_title()}
        </h2>
        <p className={styles.sub} id="pcv-label">
          {m.landing_share_sub()}
        </p>
        <div
          className={styles.variants}
          role="radiogroup"
          aria-labelledby="pcv-label"
        >
          {KINDS.map((variant) => (
            <label key={variant.id} className={styles.variant}>
              <input
                type="radio"
                name="pcv"
                value={variant.id}
                aria-controls="pc-stack"
                checked={kind === variant.id}
                onChange={() => {
                  setKind(variant.id);
                  setLive(m.landing_share_showing({ name: variant.name() }));
                }}
              />
              <b>{variant.name()}</b> <span>{variant.detail()}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          className={`${btnPrimary} ${styles.cta}`}
          onClick={onSignUp}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          {m.landing_start()}
        </button>
      </div>
      <figure className={styles.stack} id="pc-stack">
        {KINDS.map((variant) => (
          <img
            key={variant.id}
            className={
              kind === variant.id ? `${styles.card} ${styles.on}` : styles.card
            }
            src={`/landing/postcard-${variant.id}-day.webp`}
            width={1080}
            height={1080}
            alt={variant.alt()}
            loading={variant.id === KINDS[0].id ? undefined : 'lazy'}
            decoding="async"
          />
        ))}
        <figcaption className={styles.caption}>
          {m.landing_share_caption()}
        </figcaption>
      </figure>
      <p className={srOnly} aria-live="polite">
        {live}
      </p>
    </section>
  );
};

export default Share;
