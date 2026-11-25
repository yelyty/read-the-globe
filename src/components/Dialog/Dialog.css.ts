import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  easeOut,
  focusRing,
  hover,
  phone,
  reducedMotion,
  small,
} from '../../styles/global.css';

const rise = keyframes({
  from: { opacity: 0, translate: '0 8px', scale: '.98' },
});

const lift = keyframes({
  from: { opacity: 0, transform: 'translateY(14px) scale(.985)' },
  to: { opacity: 1, transform: 'none' },
});

const sheetUp = keyframes({ from: { translate: '0 100%' } });
const fade = keyframes({ from: { opacity: 0 } });

const base = style({
  maxHeight: 'calc(100dvh - 48px)',
  overflow: 'auto',
  overscrollBehavior: 'contain',
  margin: 'auto',
  padding: space.sp5,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  background: vars.color.surface,
  color: vars.color.text,
  selectors: {
    '&[open]': { animation: `${rise} .22s ${easeOut}` },
    '&::backdrop': { background: `rgba(${vars.shadow.ink}, .35)` },
  },
  '@media': {
    [reducedMotion]: {
      selectors: { '&[open]': { animation: `${fade} .2s ease-out` } },
    },
  },
});

/* default: a confirmation or a small form. sheet: a long form that rises from the bottom on a phone.
   hero: the big, plain sign-in card on the public pages */
export const dialog = styleVariants({
  default: [base, { width: 'min(460px, 100vw - 32px)' }],
  sheet: [
    base,
    {
      width: 'min(560px, 100vw - 48px)',
      '@media': {
        [phone]: {
          width: '100%',
          maxWidth: '100%',
          maxHeight: '92dvh',
          margin: 'auto 0 0',
          padding: `${space.sp5} ${space.sp5} 0`,
          borderBottom: 0,
          borderRadius: `${vars.radius.lg} ${vars.radius.lg} 0 0`,
          selectors: {
            '&[open]': { animation: `${sheetUp} .26s ${easeOut}` },
          },
        },
      },
    },
  ],
  hero: [
    base,
    {
      width: 'min(560px, 100% - 32px)',
      maxHeight: 'calc(100dvh - 32px)',
      padding: space.sp7,
      border: 0,
      borderRadius: 24,
      background: vars.color.background,
      selectors: {
        '&[open]': { animation: `${lift} .2s ${easeOut}` },
        '&::backdrop': { background: vars.color.overlay },
      },
      '@media': {
        [small]: { padding: space.sp5 },
        [reducedMotion]: { selectors: { '&[open]': { animation: 'none' } } },
      },
    },
  ],
});

const headBase = style({
  display: 'flex',
  gap: space.sp4,
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

export const head = styleVariants({
  default: [headBase, { marginBottom: space.sp3 }],
  sheet: [headBase, { marginBottom: space.sp4 }],
  hero: [headBase, { marginBottom: space.sp5 }],
});

const titleBase = style({ lineHeight: 1.15 });

export const title = styleVariants({
  default: [
    titleBase,
    {
      fontFamily: vars.font.display,
      fontSize: fontSize.heading,
      fontWeight: 500,
    },
  ],
  sheet: [
    titleBase,
    {
      fontFamily: vars.font.display,
      fontSize: fontSize.numerals,
      fontWeight: 500,
    },
  ],
  hero: [
    titleBase,
    {
      fontFamily: vars.font.sans,
      fontSize: fontSize.title,
      fontWeight: 800,
      lineHeight: 1.05,
      letterSpacing: '-.025em',
      textWrap: 'balance',
      '@media': { [small]: { fontSize: fontSize.title } },
    },
  ],
});

// the same round button as the theme toggle; the tint mixes with transparent so it reads the same on any card
export const close = style({
  display: 'grid',
  flex: 'none',
  placeItems: 'center',
  width: 40,
  height: 40,
  margin: `calc(${space.sp2} * -1) calc(${space.sp2} * -1) 0 0`,
  border: 0,
  borderRadius: '50%',
  background: `color-mix(in srgb, ${vars.color.text} 6%, transparent)`,
  color: vars.color.textSecondary,
  transition: `background-color .15s ${easeOut}, color .15s ${easeOut}`,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          background: `color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
          color: vars.color.text,
        },
      },
    },
  },
});

globalStyle(`${close} svg`, { width: 18, height: 18 });

export const text = style({
  maxWidth: '52ch',
  margin: `0 0 ${space.sp4}`,
  color: vars.color.textSecondary,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp3} ${space.sp5}`,
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: space.sp5,
});
