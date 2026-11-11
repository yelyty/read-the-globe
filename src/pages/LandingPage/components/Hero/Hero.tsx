import type { CSSProperties } from 'react';
import { PushPinIcon } from '@phosphor-icons/react';
import * as styles from './Hero.css';
import { btnPrimary } from '../LoginDialog/LoginDialog.css';
import { m } from '../../../../paraglide/messages.js';

// each sticker is placed by its centre (--x, --y), sized (--s), tilted (--r) and staggered (--n)
const sticker = (props: Record<string, string>) => props as CSSProperties;

const Hero = ({ onSignUp }: { onSignUp: () => void }) => {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-h">
      {/* the first mock's stickers, loose on the page like things on a desk */}

      <svg
        className={`${styles.sticker} ${styles.k1}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={sticker({
          '--x': '8%',
          '--y': '32%',
          '--s': 'clamp(64px,7.2vw,104px)',
          '--r': '-8deg',
          '--n': '0',
        })}
      >
        <g
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="12"
            y="64"
            width="68"
            height="15"
            rx="3"
            fill="var(--green)"
            stroke="var(--o-green)"
          />
          <path d="M21 64v15" stroke="#F5E6B8" strokeWidth="1.8" />
          <rect
            x="18"
            y="49"
            width="62"
            height="15"
            rx="3"
            fill="var(--rust)"
            stroke="var(--o-rust)"
          />
          <path d="M71 49v15" stroke="#F0DCD6" strokeWidth="1.8" />
          <rect
            x="24"
            y="34"
            width="54"
            height="15"
            rx="3"
            fill="var(--gold)"
            stroke="var(--o-gold)"
          />
          <path d="M33 34v15" stroke="#7A6420" strokeWidth="1.8" />
          <path
            d="M60 34v-10l5 4 5-4v10"
            fill="var(--rust)"
            stroke="var(--o-rust)"
            strokeWidth="2"
          />
        </g>
      </svg>
      <svg
        className={`${styles.sticker} ${styles.k2}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={sticker({
          '--x': '18%',
          '--y': '66%',
          '--s': 'clamp(48px,5.6vw,80px)',
          '--r': '10deg',
          '--n': '1',
        })}
      >
        <g
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="50" cy="16" r="5.5" stroke="var(--gold)" />
          <path d="M50 21.5v5" stroke="var(--gold)" />
          <circle
            cx="50"
            cy="57"
            r="31"
            fill="var(--bg2)"
            stroke="var(--gold)"
          />
          <circle
            cx="50"
            cy="57"
            r="24"
            stroke="var(--line)"
            strokeWidth="1.4"
          />
          <path
            d="M50 30.5v5M50 83.5v-5M23.5 57h5M76.5 57h-5"
            stroke="var(--ink3)"
            strokeWidth="1.6"
          />
          <g>
            <path
              d="M50 38.5 58 57 50 57 42 57 Z"
              fill="var(--rust)"
              stroke="var(--rust)"
            />
            <path
              d="M50 75.5 42 57 50 57 58 57 Z"
              fill="var(--card)"
              stroke="var(--green)"
            />
            <circle cx="50" cy="57" r="2.4" fill="var(--ink)" />
          </g>
        </g>
      </svg>
      <svg
        className={`${styles.sticker} ${styles.k3}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={sticker({
          '--x': '6%',
          '--y': '80%',
          '--s': 'clamp(56px,6.1vw,88px)',
          '--r': '-14deg',
          '--n': '2',
        })}
      >
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        >
          <circle
            cx="30"
            cy="56"
            r="17"
            fill="var(--bg2)"
            fillOpacity=".55"
            stroke="var(--ink)"
          />
          <circle
            cx="70"
            cy="56"
            r="17"
            fill="var(--bg2)"
            fillOpacity=".55"
            stroke="var(--ink)"
          />
          <path
            d="M47 53q3-5 6 0M13.5 51 5 40M86.5 51 95 40"
            stroke="var(--ink)"
          />
          <path
            d="M21 50q4-6 10-6M61 50q4-6 10-6"
            stroke="var(--card)"
            strokeWidth="2.6"
          />
        </g>
      </svg>
      <svg
        className={`${styles.sticker} ${styles.k4}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={sticker({
          '--x': '91%',
          '--y': '26%',
          '--s': 'clamp(64px,7.2vw,104px)',
          '--r': '8deg',
          '--n': '3',
        })}
      >
        <g
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="8"
            y="22"
            width="84"
            height="56"
            rx="4"
            fill="var(--card)"
            stroke="var(--ink3)"
          />
          <path d="M52 30v40" stroke="var(--line)" strokeWidth="1.8" />
          <path
            d="M16 36h26M16 46h20M16 56h24M58 58h26M58 66h20"
            stroke="var(--line)"
            strokeWidth="2"
          />
          <rect
            x="68"
            y="30"
            width="16"
            height="18"
            fill="var(--rust)"
            stroke="var(--o-rust)"
            strokeWidth="2"
          />
        </g>
      </svg>
      <svg
        className={`${styles.sticker} ${styles.k5}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={sticker({
          '--x': '82%',
          '--y': '62%',
          '--s': 'clamp(56px,6.1vw,88px)',
          '--r': '-10deg',
          '--n': '4',
        })}
      >
        <g strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M28 24h50v52H28Z"
            fill="var(--land)"
            stroke="var(--o-gold)"
          />
          <path
            d="M38 38q8 6 16-2t18 4M36 60q10-6 18 2t20-4"
            fill="none"
            stroke="var(--o-olive)"
            strokeWidth="2"
          />
          <circle cx="60" cy="49" r="3.6" fill="var(--rust)" stroke="none" />
          <rect
            x="76"
            y="22"
            width="13"
            height="56"
            rx="6.5"
            fill="var(--bg2)"
            stroke="var(--o-gold)"
          />
          <rect
            x="12"
            y="16"
            width="18"
            height="68"
            rx="9"
            fill="var(--bg2)"
            stroke="var(--o-gold)"
          />
          <ellipse
            cx="21"
            cy="17"
            rx="9"
            ry="4"
            fill="var(--card)"
            stroke="var(--o-gold)"
          />
        </g>
      </svg>
      <svg
        className={`${styles.sticker} ${styles.k6}`}
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={sticker({
          '--x': '94%',
          '--y': '80%',
          '--s': 'clamp(48px,5.0vw,72px)',
          '--r': '12deg',
          '--n': '5',
        })}
      >
        <g
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M50 10c17 0 26 13 26 26 0 18-26 46-26 46S24 54 24 36c0-13 9-26 26-26Z"
            fill="var(--rust)"
            stroke="var(--o-rust)"
          />
          <circle
            cx="50"
            cy="36"
            r="10"
            fill="var(--card)"
            stroke="var(--o-rust)"
          />
          <path
            d="M30 91q20 7 40 0"
            stroke="var(--ink3)"
            strokeWidth="1.8"
            strokeDasharray="3 5"
          />
        </g>
      </svg>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle} id="hero-h">
          <span className={styles.line1}>{m.landing_hero_line1()}</span>{' '}
          <span className={styles.line2}>{m.landing_hero_line2()}</span>
        </h1>
        <p className={styles.heroSub}>{m.landing_hero_sub()}</p>
        <div className={styles.heroCta}>
          <button type="button" className={btnPrimary} onClick={onSignUp}>
            <PushPinIcon weight="fill" aria-hidden="true" />
            {m.landing_start()}
          </button>
          <span className={styles.note}>{m.landing_hero_note()}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
