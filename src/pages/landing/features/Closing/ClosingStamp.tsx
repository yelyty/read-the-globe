import type { CSSProperties } from 'react';
import type { Feature } from 'geojson';

import * as styles from './Closing.css';
import { outline } from './outline';

export type Mark = 'set' | 'author' | 'both';

export type Stamp = {
  code: string; // numeric, as on the map
  mark: Mark;
  wash: string; // the disc under the country
  place: Record<string, string>; // size and spot round the promise
  n: number; // the order they press in
};

const FILL: Record<Mark, string> = {
  set: 'var(--olive)',
  author: 'var(--rust)',
  both: 'url(#close-hatch)',
};

// stamp positions are percentages of the section: above the middle the name shows below the stamp,
// and this close to a side it lines up with that side
const MIDDLE = 50;
const EDGE = 15;
// on a phone, every other stamp hides and the rest alternate low and high
const PHONE_PATTERN = 4;

type ClosingStampProps = {
  stamp: Stamp;
  /** its place among the stamps, for which ones a phone shows */
  index: number;
  /** what it stands for, in words: the country and its mark */
  label: string;
  /** the country's shape, once the world has loaded */
  shape?: Feature;
};

/**
 * Shows one stamp around the promise: the country on its disc, with its name on hover.
 * The name shows where it stays inside the section. On a phone, some stamps are hidden.
 * @param index - The place of the stamp in the list. It sets the delay and how the stamp shows on a phone.
 */
const ClosingStamp = ({ stamp, index, label, shape }: ClosingStampProps) => {
  // the ones high up show their name below them, the rest above, so it stays inside the section
  const tipSide = parseFloat(stamp.place.top) < MIDDLE ? 'below' : 'above';

  // …and the ones by an edge line it up with that edge, so it isn't cut off
  const tipAlign =
    parseFloat(stamp.place.left) < EDGE
      ? 'start'
      : parseFloat(stamp.place.right) < EDGE
        ? 'end'
        : 'center';

  const onPhone = index % 2 ? 'hide' : index % PHONE_PATTERN ? 'low' : 'high';

  return (
    <div
      className={`${styles.stamp} ${styles.onPhone[onPhone]}`}
      style={{ ...stamp.place, '--n': String(stamp.n) } as CSSProperties}
    >
      <svg viewBox="0 0 100 100" role="img" aria-label={label}>
        <circle cx="50" cy="50" r="50" fill={stamp.wash} />
        {shape && <path d={outline(shape)} fill={FILL[stamp.mark]} />}
      </svg>
      <span
        className={`${styles.tip[tipSide]} ${styles.tipAlign[tipAlign]}`}
        aria-hidden="true"
      >
        {label}
      </span>
    </div>
  );
};

export default ClosingStamp;
