import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  easeOut,
  hover,
  motionOk,
  narrow,
} from '../../../../styles/global.css';
import { sectionTitle } from '../../LandingPage.css';

export const close = style({
  position: 'relative',
  overflow: 'hidden',
  padding: '176px 0 208px',
  textAlign: 'center',
});
// set once the promise is in view (useReveal; at once under reduced motion)
export const stamped = style({});

export const defs = style({ position: 'absolute' });

export const inner = style({
  position: 'relative',
  zIndex: 1,
  width: 'min(1180px, 100% - 32px)',
  marginInline: 'auto',
});
export const title = style({
  ...sectionTitle,
  maxWidth: '15em',
  margin: '0 auto',
  lineHeight: 1.04,
});
export const cta = style({ marginTop: space.sp6 });

// a stamp coming down, no bounce
const press = keyframes({
  from: { opacity: 0, rotate: '-10deg', scale: '1.25' },
  to: { opacity: 1, rotate: '0deg', scale: '1' },
});

export const stamp = style({
  position: 'absolute',
  width: 'var(--s)',
  height: 'var(--s)',
  opacity: 0,
  selectors: {
    [`${stamped} &`]: { opacity: 1 },
    '&:hover': { zIndex: 2 }, // its name over the promise and the other stamps
  },
  '@media': {
    [motionOk]: {
      selectors: {
        [`${stamped} &`]: {
          animation: `${press} .48s ${easeOut} both`,
          animationDelay: 'calc(var(--n) * 120ms)',
        },
      },
    },
  },
});

// pointing at one lifts it (the disc only: its name stays put) and names it
globalStyle(`${stamp} svg`, {
  display: 'block',
  width: '100%',
  height: '100%',
  '@media': {
    [motionOk]: { transition: 'translate .24s ease-out, scale .24s ease-out' },
  },
});

globalStyle(`${stamp}:hover svg`, {
  '@media': {
    [`${motionOk} and ${hover}`]: { translate: '0 -8px', scale: '1.06' },
  },
});

/* the name: a small card like the atlas map's tip, centred on the stamp, fading in */
const tipBase = style({
  position: 'absolute',
  zIndex: 2,
  visibility: 'hidden',
  width: 'max-content',
  maxWidth: 240,
  padding: `${space.sp2} ${space.sp3}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.text,
  opacity: 0,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.3,
  textAlign: 'center',
  textWrap: 'balance',
  transition: `opacity .15s ${easeOut}, visibility .15s`,
  pointerEvents: 'none',
  selectors: {
    [`${stamp}:hover &`]: { visibility: 'visible', opacity: 1 },
  },
});

export const tipAlign = styleVariants({
  center: { left: '50%', translate: '-50% 0' },
  start: { left: 0 },
  end: { right: 0 },
});

export const tip = styleVariants({
  below: [tipBase, { top: 'calc(100% + 10px)' }],
  above: [tipBase, { bottom: 'calc(100% + 16px)' }],
});

// phones keep four stamps, two above the promise and two below (!important beats the inline spot)
export const onPhone = styleVariants({
  high: { '@media': { [narrow]: { top: '40px !important' } } },
  low: { '@media': { [narrow]: { top: 'auto !important', bottom: 32 } } },
  hide: { '@media': { [narrow]: { display: 'none' } } },
});
