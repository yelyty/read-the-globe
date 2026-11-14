import { useEffect, useState } from 'react';
import type { Feature } from 'geojson';
import { PushPinIcon } from '@phosphor-icons/react';

import { useReveal } from '../../../../hooks/useReveal';
import { worldShapes } from '../../../../utils/world';
import { m } from '../../../../paraglide/messages.js';
import { getLocale } from '../../../../paraglide/runtime.js';
import { toAlpha2 } from '../../../../utils/toIsoNumeric';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import * as styles from './Closing.css';
import ClosingStamp, { type Mark, type Stamp } from './ClosingStamp';

const STAMPS: Stamp[] = [
  {
    code: '036',
    mark: 'both',
    wash: 'var(--olive-wash)',
    place: { '--s': '92px', left: '8%', top: '16%' },
    n: 0,
  },
  {
    code: '484',
    mark: 'set',
    wash: 'var(--land-t)',
    place: { '--s': '64px', left: '21%', top: '62%' },
    n: 4,
  },
  {
    code: '804',
    mark: 'author',
    wash: 'var(--rust-wash)',
    place: { '--s': '76px', left: '4%', top: '70%' },
    n: 2,
  },
  {
    code: '578',
    mark: 'set',
    wash: 'var(--sage)',
    place: { '--s': '56px', left: '28%', top: '8%' },
    n: 6,
  },
  {
    code: '604',
    mark: 'both',
    wash: 'var(--land-t)',
    place: { '--s': '84px', right: '9%', top: '14%' },
    n: 1,
  },
  {
    code: '404',
    mark: 'author',
    wash: 'var(--olive-wash)',
    place: { '--s': '58px', right: '25%', top: '70%' },
    n: 5,
  },
  {
    code: '380',
    mark: 'set',
    wash: 'var(--rust-wash)',
    place: { '--s': '72px', right: '4%', top: '64%' },
    n: 3,
  },
  {
    code: '152',
    mark: 'both',
    wash: 'var(--sage)',
    place: { '--s': '52px', right: '28%', top: '8%' },
    n: 7,
  },
];

const LABEL: Record<Mark, (inputs: { country: string }) => string> = {
  set: m.landing_stamp_set,
  author: m.landing_stamp_author,
  both: m.landing_stamp_both,
};

// The promise, with the stamps it will collect scattered round it: they press in, one after another, once it's in view.
const Closing = ({ onSignUp }: { onSignUp: () => void }) => {
  const [ref, revealed] = useReveal<HTMLElement>();
  // the countries in the reader's language, from the browser
  const names = new Intl.DisplayNames([getLocale()], { type: 'region' });
  const [shapes, setShapes] = useState<Record<string, Feature>>();

  useEffect(() => {
    if (revealed) void worldShapes().then(setShapes);
  }, [revealed]);

  const renderStamp = (stamp: Stamp, i: number) => (
    <ClosingStamp
      key={stamp.code}
      stamp={stamp}
      index={i}
      label={LABEL[stamp.mark]({
        country: names.of(toAlpha2(stamp.code)) ?? stamp.code,
      })}
      shape={shapes?.[stamp.code]}
    />
  );

  return (
    <section
      ref={ref}
      className={revealed ? `${styles.close} ${styles.stamped}` : styles.close}
      aria-labelledby="close-h"
    >
      <svg width="0" height="0" aria-hidden="true" className={styles.defs}>
        <pattern
          id="close-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="3" height="6" fill="var(--olive)" />
          <rect x="3" width="3" height="6" fill="var(--rust)" />
        </pattern>
      </svg>
      {STAMPS.map(renderStamp)}
      <div className={styles.inner}>
        <h2 className={styles.title} id="close-h">
          {m.landing_close_title()}
        </h2>
        <button
          type="button"
          className={`${btnPrimary} ${styles.cta}`}
          onClick={onSignUp}
        >
          <PushPinIcon weight="fill" aria-hidden="true" />
          {m.landing_start()}
        </button>
      </div>
    </section>
  );
};

export default Closing;
