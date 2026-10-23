import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import {
  band,
  coarse,
  easeOut,
  hover,
  phone,
  reducedMotion,
  focusRing,
} from '../../styles/global.css';

const wide = 'screen and (min-width: 960px)';

const picked = `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.background})`;
const pickHover = `color-mix(in srgb, ${vars.color.secondary} 16%, ${vars.color.background})`;

export const page = style({ paddingBlock: '32px 56px' });

export const title = style({
  margin: '0 0 24px',
  fontFamily: vars.font.display,
  fontWeight: 500,
  fontSize: 30,
  lineHeight: 1.1,
  color: vars.color.text,
  '@media': { [phone]: { fontSize: 26 } },
});

/* ---------- empty: no books yet ---------- */
export const empty = style({
  padding: '24px 0',
  borderTop: `1px solid ${vars.color.border}`,
  borderBottom: `1px solid ${vars.color.border}`,
});
globalStyle(`${empty} h2`, {
  margin: 0,
  fontFamily: vars.font.display,
  fontSize: 22,
  fontWeight: 500,
  color: vars.color.text,
});
globalStyle(`${empty} p`, {
  margin: '4px 0 0',
  maxWidth: '56ch',
  color: vars.color.textSecondary,
});

/* ---------- layout ---------- */
export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 32,
  '@media': {
    [wide]: {
      gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 1fr)',
      gap: 48,
      alignItems: 'start',
    },
  },
});

export const stage = style({
  padding: '24px 16px',
  '@media': {
    [wide]: { position: 'sticky', top: 96 },
    [phone]: { padding: '16px 8px' },
  },
});

const deal = keyframes({
  from: { opacity: 0, transform: 'translateY(8px) rotate(-3deg)' },
});

// the card, tilted, on a second card in a soft gold beneath it
export const card = style({
  position: 'relative',
  isolation: 'isolate',
  maxWidth: 600,
  margin: '0 auto',
  rotate: '-1.5deg',
  animation: `${deal} .28s ${easeOut} both`,
  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: 8,
    background: `color-mix(in srgb, ${vars.color.secondary} 32%, ${vars.color.background})`,
    rotate: '4.5deg',
    translate: '8px 4px',
  },
  '@media': {
    [phone]: { rotate: '-1deg' },
    [reducedMotion]: { animation: 'none' },
  },
});
globalStyle(`${card}::before`, {
  '@media': { [phone]: { rotate: '3deg', translate: '4px 2px' } },
});

export const canvas = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: 8,
  outline: `1px solid ${vars.color.border}`,
  outlineOffset: -1,
});

export const foot = style({
  margin: '16px 0 0',
  textAlign: 'center',
  fontSize: 13,
  color: vars.color.textMuted,
});

/* ---------- the set-up ---------- */
export const h2 = style({
  margin: '0 0 16px',
  fontFamily: vars.font.display,
  fontSize: 22,
  fontWeight: 500,
  lineHeight: 1.15,
  color: vars.color.text,
});

export const fields = style({ display: 'grid', gap: 16, maxWidth: 440 });

export const label = style({
  display: 'block',
  fontFamily: vars.font.sans,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const kinds = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  marginTop: 8,
});

export const kind = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto',
  columnGap: 16,
  alignItems: 'start',
  alignContent: 'start',
  padding: 16,
  border: 0,
  borderRadius: 16,
  background: band,
  color: vars.color.text,
  textAlign: 'left',
  fontFamily: vars.font.sans,
  cursor: 'pointer',
  vars: { '--mk': vars.color.markerAuthor },
  selectors: {
    '&[data-kind="settings"]': { vars: { '--mk': vars.color.markerSetting } },
    '&[aria-pressed="true"]': {
      background: picked,
      boxShadow: `inset 0 0 0 1.5px ${vars.color.textSecondary}`,
    },
  },
  ':focus-visible': focusRing,
  '@media': {
    [hover]: {
      transition: 'background-color .15s ease-out',
      selectors: { '&[aria-pressed="false"]:hover': { background: pickHover } },
    },
    [reducedMotion]: { transition: 'none' },
    [phone]: { padding: '16px 8px', columnGap: 8 },
  },
});

// a perforated stamp in the kind's mark
export const kindStamp = style({
  gridRow: '1 / 3',
  width: 32,
  height: 40,
  padding: 3,
  border: '2px dotted var(--mk)',
  borderRadius: 2,
  background: 'var(--mk) content-box',
  boxShadow: `inset 0 0 0 3px ${vars.color.surface}`,
});

export const kindN = style({
  fontFamily: vars.font.display,
  fontWeight: 400,
  fontSize: 26,
  lineHeight: 1,
  fontVariantNumeric: 'lining-nums tabular-nums',
});

export const kindName = style({
  marginTop: 4,
  fontSize: 13,
  lineHeight: 1.3,
  color: vars.color.textSecondary,
  selectors: { [`${kind}[aria-pressed="true"] &`]: { color: vars.color.text } },
});

export const papers = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  marginTop: 8,
});

export const paper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  minWidth: 64,
  padding: 0,
  border: 0,
  background: 'none',
  fontFamily: vars.font.sans,
  fontSize: 13,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': { color: vars.color.text, fontWeight: 500 },
  },
  ':focus-visible': focusRing,
});

// the paper's own (day) colour, as the postcard prints it
export const paperChip = style({
  width: 56,
  height: 40,
  borderRadius: 4,
  boxShadow: `0 0 0 1px ${vars.color.border}`,
  selectors: {
    [`${paper}[aria-pressed="true"] &`]: {
      boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.text}`,
    },
  },
  '@media': {
    [hover]: {
      selectors: {
        [`${paper}[aria-pressed="false"]:hover &`]: {
          boxShadow: `0 0 0 1px ${vars.color.textSecondary}`,
        },
      },
    },
  },
});

/* ---------- Style: stamps, frame, colour ---------- */
export const options = style({});

export const summary = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: 'fit-content',
  minHeight: 40,
  marginTop: 16,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.text,
  listStyle: 'none',
  cursor: 'pointer',
  // the same caret as Show countries
  '::before': {
    content: '""',
    width: 7,
    height: 7,
    borderRight: `1.5px solid ${vars.color.textMuted}`,
    borderBottom: `1.5px solid ${vars.color.textMuted}`,
    rotate: '-45deg',
    transition: `rotate .18s ${easeOut}`,
  },
  '@media': { [coarse]: { minHeight: 44 } },
});
globalStyle(`${summary}::-webkit-details-marker`, { display: 'none' });
globalStyle(`${options}[open] > ${summary}::before`, { rotate: '45deg' });

export const summaryNote = style({
  fontWeight: 400,
  color: vars.color.textMuted,
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 16px',
  marginTop: 16,
});

export const rowLabel = style([label, { width: 88 }]);

export const pills = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: 8,
});

export const pill = style({
  minHeight: 36,
  padding: '8px 16px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: 999,
  background: 'none',
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': {
      borderColor: 'transparent',
      background: picked,
      color: vars.color.text,
    },
  },
  ':focus-visible': focusRing,
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: picked, color: vars.color.text } },
    },
    [coarse]: { minHeight: 44 },
  },
});

export const swatches = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: 8,
  paddingLeft: 8,
  '@media': { [coarse]: { gap: 16 } },
});

export const swatch = style({
  position: 'relative',
  width: 32,
  height: 32,
  padding: 0,
  border: `2px solid ${vars.color.surface}`,
  borderRadius: '50%',
  boxShadow: `0 0 0 1px ${vars.color.border}`,
  cursor: 'pointer',
  transition: `box-shadow .15s ${easeOut}`,
  // a 40px target that never overlaps its neighbours
  '::before': {
    content: '""',
    position: 'absolute',
    inset: -5,
    borderRadius: '50%',
  },
  selectors: {
    '&[aria-pressed="true"]': {
      boxShadow: `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.text}`,
    },
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: 3,
  },
  '@media': {
    [hover]: {
      selectors: {
        '&[aria-pressed="false"]:hover': {
          boxShadow: `0 0 0 1px ${vars.color.textSecondary}`,
        },
      },
    },
  },
});

export const colorName = style({
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.textSecondary,
});

export const send = style({ marginTop: 32, paddingTop: 24 });

export const actions = style({ display: 'flex', flexWrap: 'wrap', gap: 16 });

const button = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: '8px 24px',
  borderRadius: 999,
  fontFamily: vars.font.sans,
  fontWeight: 500,
  fontSize: 15,
  textDecoration: 'none',
  cursor: 'pointer',
  ':focus-visible': focusRing,
} as const;

export const primary = style({
  ...button,
  border: 0,
  background: vars.color.primary,
  color: vars.color.onAccent,
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: vars.color.primaryHover } },
    },
  },
});

export const quiet = style({
  ...button,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  selectors: { '&[disabled]': { cursor: 'progress', opacity: 0.72 } },
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: vars.color.backgroundDeep } },
    },
  },
});
globalStyle(`${primary} svg, ${quiet} svg`, {
  width: 16,
  height: 16,
  flex: 'none',
});

export const status = style({
  margin: '16px 0 0',
  fontSize: 15,
  color: vars.color.textSecondary,
  selectors: { '&:empty': { display: 'none' } },
});
