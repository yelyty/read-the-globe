import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import {
  band,
  focusRing,
  forcedColors,
  hover,
  phone,
  reducedMotion,
} from '../../styles/global.css';

export const page = style({
  maxWidth: 760,
  marginInline: 'auto',
  paddingBlock: '32px 56px',
});

export const head = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '8px 16px',
  marginBottom: 24,
});

export const title = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 16,
  margin: 0,
  fontFamily: vars.font.display,
  fontWeight: 500,
  fontSize: 30,
  lineHeight: 1.1,
  color: vars.color.text,
  '@media': { [phone]: { fontSize: 26 } },
});
globalStyle(`${title} svg`, {
  width: 28,
  height: 28,
  flex: 'none',
  color: vars.color.textSecondary,
});

export const since = style({
  margin: 0,
  fontSize: 15,
  color: vars.color.textSecondary,
});

/* ---------- forms ---------- */
export const form = style({ maxWidth: 520 });

globalStyle(`${form} input[readonly]`, {
  background: vars.color.background,
  borderColor: vars.color.border,
  color: vars.color.textSecondary,
  cursor: 'default',
  boxShadow: 'none',
});

export const hint = style({
  margin: '8px 0 0',
  fontSize: 15,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px 16px',
  marginTop: 8,
});

// a status, so not green: green is only for what the reader can press
export const status = style({
  margin: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.oliveInk,
});

/* ---------- buttons: a settings page's, one step quieter than the app's main actions ---------- */
const button = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: '8px 24px',
  border: 0,
  borderRadius: 999,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  textDecoration: 'none',
  cursor: 'pointer',
  ':focus-visible': focusRing,
} as const;

export const primary = style({
  ...button,
  background: vars.color.primary,
  color: vars.color.onAccent,
  selectors: { '&[disabled]': { cursor: 'progress', opacity: 0.72 } },
  '@media': {
    [hover]: {
      selectors: {
        '&:not([disabled]):hover': { background: vars.color.primaryHover },
      },
    },
  },
});

// on the band, the quiet buttons take the page colour so they still read as buttons
export const quiet = style({
  ...button,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.background,
  color: vars.color.text,
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: vars.color.backgroundDeep } },
    },
  },
});

// the opener for Delete: outlined in rust, without the weight of the confirming action
export const dangerOutline = style({
  ...button,
  background: vars.color.background,
  boxShadow: `inset 0 0 0 1.5px ${vars.color.markerAuthor}`,
  color: vars.color.markerAuthor,
  '@media': {
    [hover]: { selectors: { '&:hover': { background: vars.color.rustWash } } },
    [forcedColors]: { border: '1.5px solid' },
  },
});

export const danger = style({
  ...button,
  background: vars.color.markerAuthor,
  color: vars.color.background,
  selectors: { '&[disabled]': { opacity: 0.5, cursor: 'not-allowed' } },
  '@media': {
    [hover]: {
      selectors: {
        '&:not([disabled]):hover': {
          background: `color-mix(in srgb, ${vars.color.markerAuthor} 82%, ${vars.color.text})`,
        },
      },
    },
  },
});
globalStyle(
  `${primary} svg, ${quiet} svg, ${dangerOutline} svg, ${danger} svg`,
  { width: 15, height: 15, flex: 'none' }
);

export const linkBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 2px',
  margin: '-8px -2px',
  background: 'none',
  border: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.textSecondary,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  '@media': {
    [hover]: { selectors: { '&:hover': { color: vars.color.text } } },
  },
});
globalStyle(`${linkBtn} svg`, { width: 16, height: 16, flex: 'none' });

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
