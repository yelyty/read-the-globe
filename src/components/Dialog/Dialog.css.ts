import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import {
  band,
  easeOut,
  fill,
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
  margin: 'auto',
  padding: 24,
  overflow: 'auto',
  overscrollBehavior: 'contain',
  background: vars.color.surface,
  color: vars.color.text,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 16,
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
          padding: '24px 24px 0',
          borderRadius: '16px 16px 0 0',
          borderBottom: 0,
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
      padding: 40,
      background: vars.color.background,
      border: 0,
      borderRadius: 24,
      selectors: {
        '&[open]': { animation: `${lift} .2s ${easeOut}` },
        '&::backdrop': { background: 'rgba(28, 24, 17, 0.48)' },
      },
      '@media': {
        [small]: { padding: 24 },
        [reducedMotion]: { selectors: { '&[open]': { animation: 'none' } } },
      },
    },
  ],
});

const headBase = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
});

export const head = styleVariants({
  default: [headBase, { marginBottom: 12 }],
  sheet: [headBase, { marginBottom: 16 }],
  hero: [headBase, { marginBottom: 24 }],
});

const titleBase = style({ margin: 0, lineHeight: 1.15 });

export const title = styleVariants({
  default: [
    titleBase,
    { fontFamily: vars.font.display, fontSize: 22, fontWeight: 500 },
  ],
  sheet: [
    titleBase,
    { fontFamily: vars.font.display, fontSize: 26, fontWeight: 500 },
  ],
  hero: [
    titleBase,
    {
      fontFamily: vars.font.sans,
      fontWeight: 800,
      fontSize: 32,
      lineHeight: 1.05,
      letterSpacing: '-.025em',
      textWrap: 'balance',
      '@media': { [small]: { fontSize: 28 } },
    },
  ],
});

const closeBase = style({
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
  width: 40,
  height: 40,
  margin: '-8px -8px 0 0',
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'none',
  color: vars.color.textSecondary,
  cursor: 'pointer',
  ':focus-visible': focusRing,
});

globalStyle(`${closeBase} svg`, { width: 18, height: 18 });

export const close = styleVariants({
  default: [
    closeBase,
    {
      '@media': {
        [hover]: {
          selectors: {
            '&:hover': { background: band, color: vars.color.text },
          },
        },
      },
    },
  ],
  sheet: [
    closeBase,
    {
      '@media': {
        [hover]: {
          selectors: {
            '&:hover': { background: fill, color: vars.color.text },
          },
        },
      },
    },
  ],
  hero: [
    closeBase,
    {
      background: vars.color.backgroundDeep,
      ':hover': { color: vars.color.text },
    },
  ],
});

export const text = style({
  margin: '0 0 16px',
  maxWidth: '52ch',
  color: vars.color.textSecondary,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px 24px',
  marginTop: 24,
});
