import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/theme.css';
import { phone } from '../../../LandingPage/LandingPage.css';
import {
  band,
  focusRing,
  hover,
  reducedMotion,
} from '../../../../styles/global.css';

/* ---------- the confirmation dialog ---------- */
const dialogIn = keyframes({
  from: { opacity: 0, translate: '0 8px', scale: '.98' },
});
const fadeIn = keyframes({ from: { opacity: 0 } });

export const dialog = style({
  width: 'min(460px, 100vw - 32px)',
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
    '&[open]': { animation: `${dialogIn} .22s cubic-bezier(.2, .8, .25, 1)` },
    '&::backdrop': { background: `rgba(${vars.shadow.ink}, .35)` },
  },
  '@media': {
    [reducedMotion]: {
      selectors: { '&[open]': { animation: `${fadeIn} .22s ease-out` } },
    },
  },
});

export const dialogHead = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 12,
});

export const dialogTitle = style({
  margin: 0,
  fontFamily: vars.font.display,
  fontSize: 22,
  fontWeight: 500,
  lineHeight: 1.15,
});

export const dialogText = style({
  margin: '0 0 16px',
  maxWidth: '52ch',
  color: vars.color.textSecondary,
});

export const close = style({
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
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: band, color: vars.color.text } },
    },
  },
});
globalStyle(`${close} svg`, { width: 18, height: 18 });

export const keepCopy = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 12px',
  margin: '0 0 16px',
  padding: '12px 16px',
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
});
globalStyle(`${keepCopy} > p:first-child`, {
  flexBasis: '100%',
  margin: 0,
  color: vars.color.text,
});

export const dialogActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px 24px',
  marginTop: 24,
});

export const item = style({
  marginTop: 16,
  padding: 24,
  borderRadius: 16,
  background: band,
  selectors: { '&:first-of-type': { marginTop: 0 } },
  '@media': { [phone]: { padding: 16 } },
});

export const dangerItem = style([
  item,
  {
    background: `color-mix(in srgb, ${vars.color.markerAuthor} 8%, ${vars.color.background})`,
  },
]);

export const itemTitle = style({
  margin: 0,
  fontFamily: vars.font.display,
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.2,
  color: vars.color.text,
  selectors: { [`${dangerItem} &`]: { color: vars.color.markerAuthor } },
});

export const itemText = style({
  margin: '8px 0 16px',
  maxWidth: '52ch',
  color: vars.color.textSecondary,
});

export const status = style({
  margin: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.oliveInk,
});
