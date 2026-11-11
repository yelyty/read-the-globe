import { useState } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import { srOnly } from '../../../../styles/global.css';
import * as s from './Share.css';

const KINDS = [
  {
    id: 'authors',
    name: 'Where your authors are from',
    detail: 'a stamp for every author’s country',
    alt: 'An example postcard: Mira’s atlas, where her authors come from: a sheet of stamps for 36 of 195 countries, from 48 books on 6 continents.',
  },
  {
    id: 'settings',
    name: 'Where your books are set',
    detail: 'a stamp for every country a story visits',
    alt: 'An example postcard: Mira’s atlas, where her books are set: a sheet of stamps for 41 of 195 countries, from 48 books on 6 continents.',
  },
  {
    id: 'year',
    name: 'A year in books',
    detail: 'one card for each year you’ve logged, ready every December',
    alt: 'An example year postcard: Mira’s 2025, stamps for 27 countries on 5 continents, from 29 books.',
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
          Share your journey with friends.
        </h2>
        <p className={s.sub} id="pcv-label">
          Send a card home from wherever your reading has been. Pick one of
          three:
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
                  setLive(`Showing: ${k.name}`);
                }}
              />
              <b>{k.name}</b> <span>{k.detail}</span>
            </label>
          ))}
        </div>
        <button
          type="button"
          className={`${btnPrimary} ${s.cta}`}
          onClick={onSignUp}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          Start your atlas
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
            alt={k.alt}
            loading={k.id === KINDS[0].id ? undefined : 'lazy'}
            decoding="async"
          />
        ))}
        <figcaption className={s.caption}>
          Mira is an example reader. Every card is saved as a picture, ready for
          any app.
        </figcaption>
      </figure>
      <p className={srOnly} aria-live="polite">
        {live}
      </p>
    </section>
  );
};

export default Share;
