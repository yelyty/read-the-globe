import { m } from '../../paraglide/messages.js';
import * as styles from './GoalsPage.css';

// the ink's noise pattern differs from one postmark to the next
const SEED_STEP = 7;

/* The reached stamp, inked like a real postmark: wavy cancellation lines trailing over the plate, a double ring with
   "GOAL REACHED" running round it, a little pennant over the date, and a rough edge from an SVG turbulence filter. */
const Postmark = ({ id, date }: { id: number; date: string }) => (
  <svg className={styles.stamp} viewBox="0 0 120 80" aria-hidden="true">
    <defs>
      <filter id={`ink-${id}`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency=".9"
          numOctaves={2}
          seed={String(id).length * SEED_STEP}
        />
        <feDisplacementMap in="SourceGraphic" scale="1.6" />
      </filter>
      <path
        id={`arc-${id}`}
        d="M84 40m-23.5 0a23.5 23.5 0 1 1 47 0a23.5 23.5 0 1 1-47 0"
      />
    </defs>
    <g filter={`url(#ink-${id})`}>
      <path
        className={styles.pmWave}
        d="M2 27q6.5-5 13 0t13 0 13 0 13 0M2 35q6.5-5 13 0t13 0 13 0 13 0M2 43q6.5-5 13 0t13 0 13 0 13 0M2 51q6.5-5 13 0t13 0 13 0 13 0"
      />
      <circle
        className={`${styles.pmRing} ${styles.pmRingOut}`}
        cx="84"
        cy="40"
        r="31"
      />
      <circle className={styles.pmRing} cx="84" cy="40" r="18.5" />
      <text className={styles.pmArc}>
        <textPath href={`#arc-${id}`} textLength="146" lengthAdjust="spacing">
          {`${m.goals_postmark()} ✦ ${m.goals_postmark()} ✦`}
        </textPath>
      </text>
      <path
        className={styles.pmFlag}
        d="M80 26.5v11M80 27h8.5l-2.6 2.8 2.6 2.9H80"
      />
      <text className={styles.pmDate} x="84" y="49" textAnchor="middle">
        {date}
      </text>
    </g>
  </svg>
);

export default Postmark;
