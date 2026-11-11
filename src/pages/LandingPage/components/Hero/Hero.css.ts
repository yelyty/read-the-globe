import { keyframes, style } from '@vanilla-extract/css';
import { headline } from '../../LandingPage.css';
import { vars } from '../../../../styles/theme.css';
import { reducedMotion } from '../../../../styles/global.css';

const settle = 'cubic-bezier(.16, 1, .3, 1)'; // one-time set-in, a longer tail than the UI's ease-out
const motionOk = '(prefers-reduced-motion: no-preference)';
const narrow = 'screen and (max-width: 899px)';

export const hero = style({
  position: 'relative',
  padding: '64px 0 56px',
  textAlign: 'center',
  overflow: 'hidden',
  '@media': { [narrow]: { paddingTop: 96 } },
});

/* the hero sets in once on load: the two headline lines, then the line under them, then the button */
const setIn = keyframes({
  from: { opacity: 0, translate: '0 24px', filter: 'blur(4px)' },
});

const fadeIn = keyframes({ from: { opacity: 0 } });

const enter = (delay: number) => ({
  '@media': {
    [motionOk]: { animation: `${setIn} .72s ${settle} ${delay}s both` },
    [reducedMotion]: { animation: `${fadeIn} .4s ease-out both` },
  },
});

export const heroInner = style({
  position: 'relative',
  zIndex: 1,
  maxWidth: 760,
  margin: '0 auto',
  paddingInline: 16,
});

export const heroTitle = style({
  ...headline,
  fontSize: 'clamp(40px, 6.4vw, 84px)',
});
export const line1 = style({ display: 'block', ...enter(0) });
export const line2 = style({ display: 'block', ...enter(0.12) });

export const heroSub = style({
  maxWidth: '34em',
  margin: '24px auto 0',
  fontSize: 'clamp(17px, 1.5vw, 19px)',
  color: vars.color.textSecondary,
  textWrap: 'pretty',
  ...enter(0.28),
});

export const heroCta = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  marginTop: 32,
  ...enter(0.4),
});

export const note = style({
  fontFamily: vars.font.sans,
  fontSize: 15,
  lineHeight: 1,
  color: vars.color.textMuted,
});

/* the stickers, tilted and kept to the margins of the headline: they turn in, then drift */
const stkIn = keyframes({
  from: { opacity: 0, scale: '.9', rotate: 'calc(var(--r) - 18deg)' },
});

const stkDrift = keyframes({ to: { translate: '0 -8px' } });

export const sticker = style({
  position: 'absolute',
  left: 'calc(var(--x) - var(--s) / 2)',
  top: 'calc(var(--y) - var(--s) / 2)',
  width: 'var(--s)',
  height: 'var(--s)',
  rotate: 'var(--r)',
  overflow: 'visible',
  pointerEvents: 'none',
  '@media': {
    [motionOk]: {
      animation: `${stkIn} .64s ${settle} both, ${stkDrift} 8s ease-in-out infinite alternate`,
      animationDelay:
        'calc(.5s + var(--n) * 80ms), calc(1.2s + var(--n) * -1.3s)',
    },
  },
});

// narrow screens keep two stickers, tucked above the headline (!important beats the inline placement)
const hide = { '@media': { [narrow]: { display: 'none' } } };

const corner = (x: string) => ({
  '@media': {
    [narrow]: {
      vars: {
        '--x': `${x} !important`,
        '--y': '24px !important',
        '--s': '64px !important',
      },
    },
  },
});

export const k1 = style(corner('12%'));
export const k2 = style(hide);
export const k3 = style(hide);
export const k4 = style(corner('88%'));
export const k5 = style(hide);
export const k6 = style(hide);
