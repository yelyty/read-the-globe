import { useState } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import { srOnly } from '../../../../styles/global.css';
import * as s from './Share.css';
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
    <section className={s.share} id="share" aria-labelledby="share-h">
      <div>
        <h2 className={s.title} id="share-h">
          {m.landing_share_title()}
        </h2>
        <p className={s.sub} id="pcv-label">
          {m.landing_share_sub()}
        </p>
        <div
          className={s.variants}
          role="radiogroup"
          aria-labelledby="pcv-label"
        >
          {KINDS.map((k) => (
            <label key={k.id} className={s.variant}>
              <input
                type="radio"
                name="pcv"
                value={k.id}
                aria-controls="pc-stack"
                checked={kind === k.id}
                onChange={() => {
                  setKind(k.id);
                  setLive(m.landing_share_showing({ name: k.name() }));
                }}
              />
              <b>{k.name()}</b> <span>{k.detail()}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          className={`${btnPrimary} ${s.cta}`}
          onClick={onSignUp}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          {m.landing_start()}
        </button>
      </div>
      <figure className={s.stack} id="pc-stack">
        {KINDS.map((k) => (
          <img
            key={k.id}
            className={kind === k.id ? `${s.card} ${s.on}` : s.card}
            src={`/landing/postcard-${k.id}-day.webp`}
            width={1080}
            height={1080}
            alt={k.alt()}
            loading={k.id === KINDS[0].id ? undefined : 'lazy'}
            decoding="async"
          />
        ))}
        <figcaption className={s.caption}>
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
