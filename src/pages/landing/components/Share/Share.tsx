import { useState } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';

import { srOnly } from '../../../../styles/global.css';
import { m } from '../../../../paraglide/messages.js';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import * as styles from './Share.css';

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

type Kind = (typeof KINDS)[number];

// The kinds of postcard on the left; the app's card for the chosen kind on the right (always the day cards).
const Share = ({ onSignUp }: { onSignUp: () => void }) => {
  const [kind, setKind] = useState<string>(KINDS[0].id);
  // screen readers hear which card now shows; empty until the reader picks
  const [live, setLive] = useState('');

  // screen readers are told which card now shows
  const handleKindChange = (variant: Kind) => () => {
    setKind(variant.id);
    setLive(m.landing_share_showing({ name: variant.name() }));
  };

  const renderChoice = (variant: Kind) => (
    <label key={variant.id} className={styles.variant}>
      <input
        type="radio"
        name="pcv"
        value={variant.id}
        aria-controls="pc-stack"
        checked={kind === variant.id}
        onChange={handleKindChange(variant)}
      />
      <b>{variant.name()}</b> <span>{variant.detail()}</span>
    </label>
  );

  // every card is in the stack; the chosen one shows, and only the first loads up front
  const renderCard = (variant: Kind) => (
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
  );

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
          {KINDS.map(renderChoice)}
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
        {KINDS.map(renderCard)}
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
