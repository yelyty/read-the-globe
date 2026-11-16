import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import {
  caps,
  coarse,
  easeOut,
  fill,
  fillHover,
  focusRing,
  hover,
  phone,
  reducedMotion,
} from '../../styles/global.css';
import { hint } from '../../components/Hint/Hint.css';

export { srOnly } from '../../styles/global.css';

/* the shared Dialog's sheet variant; an edit wears a gold edge so it isn't mistaken for a new book */
export const sheet = style({
  selectors: {
    '&[data-editing="true"]': {
      borderColor: vars.color.secondary,
      boxShadow: '0 0 0 3px rgba(199, 165, 54, .22)',
    },
  },
});

export const editing = style({
  margin: '2px 0 0',
  fontFamily: vars.font.display,
  fontSize: 18,
  lineHeight: 1.2,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});
export const sub = style({
  margin: '4px 0 0',
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
  selectors: { '&[hidden]': { visibility: 'hidden', display: 'grid' } },
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: fill, color: vars.color.text } },
    },
  },
});
globalStyle(`${close} svg`, { width: 18, height: 18 });

/* ---------- Will mark ---------- */
export const preview = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '4px 16px',
  margin: '-8px 0 16px',
  fontSize: 14,
  color: vars.color.textSecondary,
});
export const label = style({ ...caps, fontWeight: 500 });
export const mark = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
});

// a mark's dot before a field's label
export const labelDot = style({ marginRight: 8 });
export const markNote = style({ color: vars.color.textMuted });

/* ---------- places ---------- */
export const set = style({
  minWidth: 0,
  margin: '0 0 16px',
  padding: 0,
  border: 0,
});
globalStyle(`${set} > legend`, { padding: 0 });
globalStyle(`${set} > legend + ${hint}`, { margin: '0 0 8px' });

const placeGrid = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) 40px',
  gap: 8,
  alignItems: 'start',
} as const;

export const placesHead = style({
  ...placeGrid,
  marginBottom: 8,
  ...caps,
  fontWeight: 500,
  '@media': { [phone]: { display: 'none' } },
});
export const places = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});
export const place = style({
  ...placeGrid,
  '@media': {
    [phone]: {
      gridTemplateColumns: 'minmax(0, 1fr) 40px',
      paddingBottom: 8,
      borderBottom: `1px solid ${vars.color.border}`,
    },
  },
});

globalStyle(`${place} > button`, {
  alignSelf: 'center',
  margin: 0,
  '@media': { [phone]: { gridColumn: 2, gridRow: '1 / span 2' } },
});

globalStyle(`${place} > div`, { '@media': { [phone]: { gridColumn: 1 } } });

// an imagined place has no country: its name takes the country's room
globalStyle(`${place}[data-imagined] > input`, {
  gridColumn: '1 / 3',
  '@media': { [phone]: { gridColumn: 1 } },
});

/* ---------- under a country: what an old or dependent name counts as, and the choice for a state that split ---------- */
export const thenNote = style({
  marginTop: 8,
  fontSize: 14,
  color: vars.color.textSecondary,
  selectors: { [`${place} > &`]: { gridColumn: '1 / -1', marginTop: 0 } },
});
globalStyle(`${thenNote} p`, { margin: 0 });
globalStyle(`${thenNote} b`, { fontWeight: 500, color: vars.color.text });
export const thenChange = style({
  marginLeft: 4,
  padding: 0,
  border: 0,
  background: 'none',
  font: 'inherit',
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
export const thenPicks = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
});

// the same pills as the map's Show filter: a flat fill, no bolder weight when picked
globalStyle(`${thenPicks} button`, {
  minHeight: 32,
  padding: '4px 16px',
  border: '1px solid transparent',
  borderRadius: 999,
  background: fill,
  fontFamily: vars.font.sans,
  fontSize: 14,
  fontWeight: 500,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  transition: `scale .16s ${easeOut}`,
  '@media': {
    [coarse]: { minHeight: 44 },
    [reducedMotion]: { transition: 'none' },
    '(forced-colors: active)': { borderColor: 'ButtonText' },
  },
});

globalStyle(`${thenPicks} button:active`, { scale: '.97' });

globalStyle(`${thenPicks} button:hover`, {
  '@media': { [hover]: { background: fillHover, color: vars.color.text } },
});

globalStyle(`${thenPicks} button:focus-visible`, focusRing);

globalStyle(`${thenPicks} button[aria-pressed="true"]`, {
  background: `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.background})`,
  color: vars.color.text,
});

export const imagined = style({
  gridColumn: '1 / -1',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  width: 'fit-content',
  minHeight: 32,
  fontSize: 14,
  color: vars.color.textSecondary,
  cursor: 'pointer',
});

export const month = style({ display: 'flex', gap: 8, maxWidth: 400 });
export const monthPick = style({ flex: '1.4 1 0', minWidth: 0 });
export const yearPick = style({ flex: '1 1 0', minWidth: 0 });

export const themes = style({ margin: '0 0 16px', padding: 0, border: 0 });

globalStyle(`${themes} summary`, {
  cursor: 'pointer',
  fontWeight: 500,
  color: vars.color.textSecondary,
});

globalStyle(`${themes} ul`, {
  listStyle: 'none',
  margin: '8px 0 0 16px',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

globalStyle(`${themes} label`, {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 32,
  cursor: 'pointer',
});

export const formError = style({
  margin: '16px 0 0',
  padding: '8px 16px',
  borderRadius: 8,
  background: vars.color.rustWash,
  color: vars.color.error,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.4,
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '16px 24px',
  marginTop: 16,
  '@media': {
    [phone]: {
      position: 'sticky',
      bottom: 0,
      margin: '16px -24px 0',
      padding: '16px 24px',
      background: vars.color.surface,
      borderTop: `1px solid ${vars.color.border}`,
      flexWrap: 'nowrap',
    },
  },
});

// Remove: a link-styled Button in the error colour, pushed to the left. && outranks the Button's own colour
export const danger = style({
  marginRight: 'auto',
  selectors: { '&&': { color: vars.color.error } },
});

// the primary Button fills the row on a phone
export const submit = style({
  justifyContent: 'center',
  '@media': { [phone]: { flex: 1 } },
});
