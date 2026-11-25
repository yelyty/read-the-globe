import { keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  compact,
  headline,
  motionOk,
  reducedMotion,
} from '../../../../styles/global.css';

const settle = 'cubic-bezier(.16, 1, .3, 1)'; // one-time set-in, a longer tail than the UI's ease-out

export const hero = style({
  position: 'relative',
  overflow: 'hidden',
  padding: `${space.sp8} 0 ${space.sp8}`,
  textAlign: 'center',
  '@media': { [compact]: { paddingTop: space.sp9 } },
});

/* the hero sets in once on load: the two headline lines, then the line under them, then the button */
const setIn = keyframes({
  from: { opacity: 0, filter: 'blur(4px)', translate: '0 24px' },
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
  paddingInline: space.sp4,
});

export const heroTitle = style({
  ...headline,
  fontSize: 'clamp(40px, 6.4vw, 84px)',
});
export const line1 = style({ display: 'block', ...enter(0) });
export const line2 = style({ display: 'block', ...enter(0.12) });

export const heroSub = style({
  maxWidth: '34em',
  margin: `${space.sp5} auto 0`,
  color: vars.color.textSecondary,
  fontSize: 'clamp(17px, 1.5vw, 19px)',
  textWrap: 'pretty',
  ...enter(0.28),
});

export const heroCta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp4,
  alignItems: 'center',
  marginTop: space.sp6,
  ...enter(0.4),
});

export const note = style({
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1,
});

/* the stickers, tilted and kept to the margins of the headline: they turn in, then drift */
const stkIn = keyframes({
  from: { opacity: 0, rotate: 'calc(var(--r) - 18deg)', scale: '.9' },
});

const stkDrift = keyframes({ to: { translate: '0 -8px' } });

export const sticker = style({
  position: 'absolute',
  top: 'calc(var(--y) - var(--s) / 2)',
  left: 'calc(var(--x) - var(--s) / 2)',
  width: 'var(--s)',
  height: 'var(--s)',
  overflow: 'visible',
  rotate: 'var(--r)',
  pointerEvents: 'none',
  '@media': {
    [motionOk]: {
      animation: `${stkIn} .64s ${settle} both, ${stkDrift} 8s ease-in-out infinite alternate`,
      animationDelay:
        'calc(.5s + var(--n) * 80ms), calc(1.2s + var(--n) * -1.3s)',
    },
  },
});

// narrow screens keep two stickers, tucked above the headline (!important beats the inline placement).
// Centered 48px down, a 64px sticker spans 16–80px: inside the hero, which clips its edges, even while it
// turns in and drifts, and clear of the headline under the hero's 96px top padding
const hide = { '@media': { [compact]: { display: 'none' } } };

const corner = (left: string) => ({
  '@media': {
    [compact]: {
      vars: {
        '--x': `${left} !important`,
        '--y': '48px !important',
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
