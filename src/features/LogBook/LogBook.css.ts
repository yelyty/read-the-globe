import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  bareButton,
  caps,
  coarse,
  easeOut,
  fill,
  fillHover,
  focusRing,
  forcedColors,
  hover,
  phone,
  pressed,
  reducedMotion,
} from '../../styles/global.css';
import { hint } from '../../components/Hint/Hint.css';
import { formError as fieldFormError } from '../../components/Field/Field.css';

export { srOnly } from '../../styles/global.css';

/* the shared Dialog's sheet variant, without its border; the element selector outranks the variant's class */
export const sheet = style({
  selectors: {
    'dialog&': { border: 0 },
  },
});

export const editing = style({
  display: '-webkit-box',
  overflow: 'hidden',
  margin: '2px 0 0',
  fontFamily: vars.font.display,
  fontSize: fontSize.item,
  lineHeight: 1.2,
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});
export const sub = style({
  margin: `${space.sp1} 0 0`,
  color: vars.color.textSecondary,
});

export const close = style({
  display: 'grid',
  flex: 'none',
  placeItems: 'center',
  width: 40,
  height: 40,
  margin: `calc(${space.sp2} * -1) calc(${space.sp2} * -1) 0 0`,
  border: 0,
  borderRadius: '50%',
  background: 'none',
  color: vars.color.textSecondary,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: { '&[hidden]': { display: 'grid', visibility: 'hidden' } },
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
  gap: `${space.sp1} ${space.sp4}`,
  alignItems: 'center',
  margin: `calc(${space.sp2} * -1) 0 ${space.sp4}`,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
});
export const label = style({ ...caps, fontWeight: 500 });
export const mark = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
});

// a mark's dot before a field's label
export const labelDot = style({ marginRight: space.sp2 });
export const markNote = style({ color: vars.color.textMuted });

/* ---------- places ---------- */
export const set = style({
  minWidth: 0,
  margin: `0 0 ${space.sp4}`,
  border: 0,
});
globalStyle(`${set} > legend`, { padding: 0 });
globalStyle(`${set} > legend + ${hint}`, { margin: `0 0 ${space.sp2}` });

const placeGrid = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) 40px',
  gap: space.sp2,
  alignItems: 'start',
} as const;

export const placesHead = style({
  ...placeGrid,
  marginBottom: space.sp2,
  ...caps,
  fontWeight: 500,
  '@media': { [phone]: { display: 'none' } },
});
export const places = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp2,
  listStyle: 'none',
});
export const place = style({
  ...placeGrid,
  '@media': {
    [phone]: {
      gridTemplateColumns: 'minmax(0, 1fr) 40px',
      paddingBottom: space.sp2,
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
  marginTop: space.sp2,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  selectors: { [`${place} > &`]: { gridColumn: '1 / -1', marginTop: 0 } },
});
globalStyle(`${thenNote} p`, { margin: 0 });
globalStyle(`${thenNote} b`, { color: vars.color.text, fontWeight: 500 });
export const thenChange = style({
  ...bareButton,
  marginLeft: space.sp1,
  color: vars.color.textSecondary,
  fontWeight: 500,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
  ':focus-visible': focusRing,
  '@media': {
    [hover]: { selectors: { '&:hover': { color: vars.color.text } } },
  },
});
export const thenPicks = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  marginTop: space.sp2,
});

// the same pills as the map's Show filter: a flat fill, no bolder weight when picked
globalStyle(`${thenPicks} button`, {
  minHeight: 32,
  padding: `${space.sp1} ${space.sp4}`,
  border: '1px solid transparent',
  borderRadius: vars.radius.pill,
  background: fill,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  transition: `scale .16s ${easeOut}`,
  cursor: 'pointer',
  '@media': {
    [coarse]: { minHeight: 44 },
    [reducedMotion]: { transition: 'none' },
    [forcedColors]: { borderColor: 'ButtonText' },
  },
});

globalStyle(`${thenPicks} button:active`, pressed);

globalStyle(`${thenPicks} button:hover`, {
  '@media': { [hover]: { background: fillHover, color: vars.color.text } },
});

globalStyle(`${thenPicks} button:focus-visible`, focusRing);

globalStyle(`${thenPicks} button[aria-pressed="true"]`, {
  background: `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.background})`,
  color: vars.color.text,
});

export const imagined = style({
  display: 'inline-flex',
  gridColumn: '1 / -1',
  gap: space.sp2,
  alignItems: 'center',
  width: 'fit-content',
  minHeight: 32,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  cursor: 'pointer',
});

export const month = style({ display: 'flex', gap: space.sp2, maxWidth: 400 });
export const monthPick = style({ flex: '1.4 1 0', minWidth: 0 });
export const yearPick = style({ flex: '1 1 0', minWidth: 0 });

export const themes = style({
  margin: `0 0 ${space.sp4}`,
  border: 0,
});

globalStyle(`${themes} summary`, {
  color: vars.color.textSecondary,
  fontWeight: 500,
  cursor: 'pointer',
});

globalStyle(`${themes} ul`, {
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp1,
  margin: `${space.sp2} 0 0 ${space.sp4}`,
  padding: 0,
  listStyle: 'none',
});

globalStyle(`${themes} label`, {
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  minHeight: 32,
  cursor: 'pointer',
});

export const formError = style([
  fieldFormError,
  { margin: `${space.sp4} 0 0` },
]);

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp4} ${space.sp5}`,
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginTop: space.sp4,
  '@media': {
    [phone]: {
      position: 'sticky',
      bottom: 0,
      flexWrap: 'nowrap',
      margin: `${space.sp4} calc(${space.sp5} * -1) 0`,
      padding: `${space.sp4} ${space.sp5}`,
      borderTop: `1px solid ${vars.color.border}`,
      background: vars.color.surface,
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
