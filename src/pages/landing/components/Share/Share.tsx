import { useState } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';

import { srOnly } from '../../../../styles/global.css';
import { m } from '../../../../paraglide/messages.js';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import * as styles from './Share.css';
import ShareCard from './ShareCard';
import ShareChoice from './ShareChoice';

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

export type Kind = (typeof KINDS)[number];

// The kinds of postcard on the left; the app's card for the chosen kind on the right (always the day cards).
const Share = ({ onSignUp }: { onSignUp: () => void }) => {
  const [kind, setKind] = useState<string>(KINDS[0].id);
  // screen readers hear which card now shows; empty until the reader picks
  const [live, setLive] = useState('');

  // screen readers are told which card now shows
  const handleKindChange = (variant: Kind) => {
    setKind(variant.id);
    setLive(m.landing_share_showing({ name: variant.name() }));
  };

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
            <ShareChoice
              key={variant.id}
              variant={variant}
              checked={kind === variant.id}
              onChoose={handleKindChange}
            />
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
        {/* every card is in the stack; the chosen one shows, and only the first loads up front */}
        {KINDS.map((variant, i) => (
          <ShareCard
            key={variant.id}
            variant={variant}
            shown={kind === variant.id}
            lazy={i > 0}
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
