import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { fontSize, space, vars } from '../../styles/theme.css';
import {
  goldBand,
  easeOut,
  focusRing,
  hover,
  phone,
  reducedMotion,
  forcedColors,
} from '../../styles/global.css';

const press = {
  selectors: { '&:not(:disabled):active': { transform: 'scale(.97)' } },
  transition: `transform 160ms ${easeOut}, background-color 160ms ${easeOut}`,
};

const caret = (size: number) => ({
  content: '""',
  width: size,
  height: size,
  flex: 'none',
  borderRight: `${size > 8 ? 2 : 1.5}px solid ${vars.color.textMuted}`,
  borderBottom: `${size > 8 ? 2 : 1.5}px solid ${vars.color.textMuted}`,
  rotate: '-45deg',
  transition: `rotate .18s ${easeOut}`,
});

export const h2 = style({
  margin: 0,
  fontFamily: vars.font.display,
  fontWeight: 500,
  fontSize: fontSize.heading,
  lineHeight: 1.2,
  color: vars.color.text,
});

const foldSummary = {
  display: 'flex',
  alignItems: 'center',
  gap: space.sp4,
  minHeight: 40,
  cursor: 'pointer',
  listStyle: 'none',
} as const;

export const yours = style({});
globalStyle(`${yours} > summary`, {
  ...foldSummary,
  paddingBottom: space.sp2,
  marginBottom: space.sp5,
  borderBottom: `1px solid ${vars.color.border}`,
});
export const sum = style({
  marginLeft: 'auto',
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  fontVariantNumeric: 'tabular-nums',
});

export const sugg = style({});
globalStyle(`${sugg} > summary`, foldSummary);
globalStyle(
  `${yours} > summary::-webkit-details-marker, ${sugg} > summary::-webkit-details-marker`,
  { display: 'none' }
);
globalStyle(`${yours} > summary::before, ${sugg} > summary::before`, caret(9));
globalStyle(
  `${yours}[open] > summary::before, ${sugg}[open] > summary::before`,
  { rotate: '45deg' }
);

export const addGoal = style({ marginTop: space.sp7 });

export const pick = style({
  maxWidth: 520,
  marginTop: space.sp4,
  padding: `${space.sp3} ${space.sp4} ${space.sp4}`,
  background: goldBand,
  borderRadius: 8,
});
globalStyle(`${pick} p`, {
  margin: `0 0 ${space.sp3}`,
  color: vars.color.text,
});
globalStyle(`${pick} b`, { fontWeight: 500 });

export const full = style({
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.textSecondary,
});

export const dests = style({
  listStyle: 'none',
  margin: '16px 0 24px',
  padding: 0,
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(208px, 1fr))',
});
export const dest = style({
  ...press,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  height: '100%',
  padding: 16,
  border: 0,
  borderRadius: 16,
  background: goldBand,
  color: vars.color.text,
  textAlign: 'left',
  fontFamily: vars.font.sans,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  ':disabled': { cursor: 'default', opacity: 0.55 },
});
export const destMap = style({
  display: 'block',
  width: '100%',
  marginBottom: 16,
});
export const destName = style({
  fontFamily: vars.font.serif,
  fontWeight: 500,
  fontSize: fontSize.heading,
  lineHeight: 1.15,
  textWrap: 'balance',
});
export const destNote = style({
  marginTop: 4,
  fontSize: fontSize.meta,
  color: vars.color.textSecondary,
  fontVariantNumeric: 'tabular-nums',
});
export const destAdd = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 'auto',
  paddingTop: 16,
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.accent,
});
globalStyle(`${destAdd} svg`, { width: 14, height: 14 });

export const more = style({ marginTop: 0 });
globalStyle(`${more} > summary`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  cursor: 'pointer',
  listStyle: 'none',
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.textSecondary,
});
globalStyle(`${more} > summary::-webkit-details-marker`, { display: 'none' });
globalStyle(`${more} > summary::before`, caret(7));
globalStyle(`${more}[open] > summary::before`, { rotate: '45deg' });
export const moreN = style({ fontWeight: 400 });
export const group = style({ marginTop: 16 });
globalStyle(`${group} h3`, {
  margin: `0 0 ${space.sp2}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.label,
  fontWeight: 500,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});
export const chips = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
});
export const chip = style({
  ...press,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: '8px 16px 8px 8px',
  borderRadius: 999,
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  color: vars.color.text,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  '@media': {
    [hover]: {
      selectors: { '&:not(:disabled):hover': { background: goldBand } },
    },
  },
});
globalStyle(`${chip} svg`, {
  width: 13,
  height: 13,
  color: vars.color.textMuted,
});
export const chipNote = style({
  marginLeft: 4,
  fontSize: fontSize.meta,
  color: vars.color.textMuted,
});

const button = {
  ...press,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: '8px 24px',
  borderRadius: 999,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
} as const;
export const primary = style({
  ...button,
  border: 0,
  background: vars.color.primary,
  color: vars.color.onAccent,
  '@media': {
    [hover]: {
      selectors: {
        '&:not(:disabled):hover': { background: vars.color.primaryHover },
      },
    },
  },
});
export const outline = style({
  ...button,
  marginTop: space.sp4,
  background: vars.color.background,
  color: vars.color.oliveInk,
  border: 0,
  boxShadow: `inset 0 0 0 1.5px ${vars.color.primary}`,
  '@media': {
    [hover]: {
      selectors: {
        '&:not(:disabled):hover': { background: vars.color.oliveWash },
      },
    },
  },
});
globalStyle(`${primary} svg, ${outline} svg`, {
  width: 16,
  height: 16,
  flex: 'none',
});

export const empty = style({
  display: 'grid',
  justifyItems: 'center',
  gap: space.sp2,
  textAlign: 'center',
  padding: `${space.sp6} 0`,
});
globalStyle(`${empty} p`, {
  margin: 0,
  maxWidth: '52ch',
  color: vars.color.textSecondary,
});
export const sticker = style({
  width: 120,
  height: 100,
  marginBottom: space.sp2,
});
export const gsHill = style({
  fill: goldBand,
  stroke: vars.color.mark,
  strokeWidth: 2.2,
});
export const gsPath = style({
  stroke: vars.color.textMuted,
  strokeWidth: 1.8,
  strokeDasharray: '3.5 4',
});
export const gsStart = style({ fill: vars.color.olive });
export const gsPole = style({ stroke: vars.color.textMuted, strokeWidth: 2.6 });
export const gsCloth = style({
  fill: vars.color.primary,
  stroke: vars.color.oliveInk,
  strokeWidth: 2,
});

export const goalList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: space.sp6,
});
export const goal = style({
  display: 'grid',
  gridTemplateColumns: '176px minmax(0, 1fr)',
  gap: `${space.sp2} ${space.sp5}`,
  alignItems: 'start',
  '@media': {
    [phone]: {
      gridTemplateColumns: '96px minmax(0, 1fr)',
      columnGap: space.sp4,
    },
  },
});
export const goalDone = style({});
export const goalMap = style({ position: 'relative' });
export const plate = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  aspectRatio: '176 / 110',
  background: vars.map.sea,
  borderRadius: 8,
});
globalStyle(`${goal} ${plate}`, {
  width: 176,
  '@media': { [phone]: { width: 96 } },
});
globalStyle(`${plate} path`, {
  strokeWidth: 0.6,
  vectorEffect: 'non-scaling-stroke',
  stroke: vars.color.border,
});
export const shapeSet = style({ fill: vars.color.olive });
export const shapeAuthor = style({ fill: vars.color.markerAuthor });
export const shapeMarked = style({});
// a goal country still to read: solid land with an ink edge
export const shapeTodo = style({
  fill: vars.map.land,
  selectors: {
    [`${plate} &`]: { stroke: vars.color.textMuted, strokeWidth: 0.9 },
  },
});
export const spine = style({
  fill: 'none',
  stroke: vars.color.textMuted,
  strokeWidth: 1,
  strokeDasharray: '2 2',
  vectorEffect: 'non-scaling-stroke',
});
export const spineIn = style({
  fill: vars.color.textSecondary,
  stroke: vars.color.textSecondary,
});
export const plank = style({
  stroke: vars.color.mark,
  strokeWidth: 2,
  strokeLinecap: 'round',
});
export const compass = style({
  position: 'absolute',
  zIndex: 1,
  right: 11,
  bottom: 10,
  width: 22,
  height: 22,
  overflow: 'visible',
  '@media': { [phone]: { display: 'none' } },
});
globalStyle(`${compass} circle`, {
  fill: vars.map.sea,
  stroke: vars.color.mark,
  strokeWidth: 0.8,
});
globalStyle(`${compass} path`, { fill: vars.color.mark });
export const compassNorth = style({
  selectors: { [`${compass} &`]: { fill: vars.color.primary } },
});

// on phones the plate sits beside the name, and the road and actions run the full width under both
export const goalBody = style({
  minWidth: 0,
  '@media': { [phone]: { display: 'contents' } },
});
export const goalHead = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 16,
  minWidth: 0,
});
export const goalName = style({
  margin: 0,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.2,
  overflowWrap: 'break-word',
});
export const goalMeta = style({
  margin: '4px 0 0',
  fontSize: fontSize.body,
  color: vars.color.textSecondary,
});
export const goalCount = style({
  flex: 'none',
  textAlign: 'right',
  fontSize: fontSize.body,
  color: vars.color.textSecondary,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});
globalStyle(`${goalCount} b`, {
  fontFamily: vars.font.serif,
  fontSize: fontSize.numerals,
  fontWeight: 400,
  color: vars.color.text,
});
export const goalPct = style({});
export const goalReached = style({
  '@media': { [phone]: { whiteSpace: 'normal', textAlign: 'right' } },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 4,
  marginTop: 4,
  fontSize: fontSize.label,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: vars.color.oliveInk,
});
export const goalPast = style({
  letterSpacing: 1,
  color: vars.color.textMuted,
});

export const goalFoot = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: `${space.sp2} ${space.sp4}`,
  marginTop: space.sp2,
  '@media': { [phone]: { gridColumn: '1 / -1' } },
});
export const goalTodo = style({
  flex: '1 1 auto',
  fontSize: fontSize.body,
  color: vars.color.textSecondary,
});
globalStyle(`${goalTodo} summary`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  cursor: 'pointer',
  listStyle: 'none',
  fontWeight: 500,
});
globalStyle(`${goalTodo} summary::-webkit-details-marker`, { display: 'none' });
globalStyle(`${goalTodo} summary::before`, caret(7));
globalStyle(`${goalTodo}[open] summary::before`, { rotate: '45deg' });
globalStyle(`${goalTodo} p`, {
  margin: '4px 0 0',
  lineHeight: 1.5,
  maxWidth: '62ch',
});
globalStyle(`${goalTodo} b`, { fontWeight: 500, color: vars.color.text });
export const goalActions = style({
  display: 'flex',
  gap: 16,
  marginLeft: 'auto',
});
export const linkBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: 0,
  background: 'none',
  border: 0,
  whiteSpace: 'nowrap',
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  '@media': {
    [hover]: { selectors: { '&:hover': { color: vars.color.text } } },
  },
});
globalStyle(`${linkBtn} svg`, { width: 16, height: 16, flex: 'none' });
// Choose books on the left; Edit and Remove goal together on the right
export const chooseBtn = style({ marginRight: 'auto' });
globalStyle(`${goalActions}:has(${chooseBtn})`, { flex: 1, marginLeft: 0 });

/* ---------- the road to the flag ---------- */
export const route = style({
  position: 'relative',
  height: 24,
  marginTop: 16,
  '@media': { [phone]: { gridColumn: '1 / -1' } },
});
export const routeTheme = style({});
const road = { position: 'absolute', left: 0, right: 16, top: '50%' } as const;
export const routeTrack = style({
  ...road,
  height: 3,
  marginTop: -1,
  borderRadius: 99,
  background: vars.color.border,
});
const fillIn = keyframes({ from: { transform: 'scaleX(0)' } });
export const routeFill = style({
  ...road,
  zIndex: 1,
  height: 7,
  marginTop: -3,
  borderRadius: 99,
  background: vars.color.primary,
  transform: 'scaleX(var(--p))',
  transformOrigin: 'left center',
  animation: `${fillIn} .6s ${easeOut}`,
  selectors: { [`${routeTheme} &`]: { background: vars.color.textMuted } },
  '@media': {
    [reducedMotion]: { animation: 'none' },
    [forcedColors]: {
      forcedColorAdjust: 'none',
      background: 'CanvasText',
    },
  },
});
export const routeStops = style({
  ...road,
  zIndex: 2,
  height: 0,
  marginTop: 1,
});
export const stop = style({
  position: 'absolute',
  left: 'calc(var(--k) * 100%)',
  top: 0,
  width: 12,
  height: 12,
  translate: '-50% -50%',
  borderRadius: '50%',
  background: vars.color.background,
  boxShadow: `inset 0 0 0 2px ${vars.color.textMuted}`,
});
export const stopHit = style([
  stop,
  {
    background: vars.color.primary,
    boxShadow: `0 0 0 2px ${vars.color.background}`,
  },
]);
export const routePin = style({
  position: 'absolute',
  zIndex: 3,
  left: 'calc(var(--p) * (100% - 16px))',
  top: '50%',
  width: 24,
  height: 24,
  transform: 'translate(-50%, -72%)',
  transition: `opacity .3s ${easeOut}`,
  selectors: { [`${goalDone} &`]: { opacity: 0 } },
});
globalStyle(`${routePin} path`, {
  fill: vars.color.primary,
  stroke: vars.color.background,
});
globalStyle(`${routeTheme} ${routePin} path`, { fill: vars.color.textMuted });
globalStyle(`${routePin} circle`, { fill: vars.color.background });
export const routeFlag = style({
  position: 'absolute',
  zIndex: 3,
  right: 0,
  top: '50%',
  width: 16,
  height: 20,
  transform: 'translateY(-84%)',
  transformOrigin: '20% 100%',
  transition: `transform .3s ${easeOut}`,
  selectors: {
    [`${goalDone} &`]: { transform: 'translateY(-92%) scale(1.3)' },
  },
});
export const flagPole = style({ stroke: vars.color.text });
export const flagCloth = style({
  fill: vars.color.text,
  selectors: { [`${goalDone} &`]: { fill: vars.color.primary } },
});

/* ---------- dialog fields ---------- */
export const field = style({ marginBottom: 16 });
export const label = style({
  display: 'block',
  marginBottom: 8,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.2,
  color: vars.color.textSecondary,
});
export const input = style({
  width: '100%',
  height: 48,
  padding: '0 16px',
  borderRadius: 12,
  background: vars.color.background,
  border: `1.5px solid ${vars.color.fieldLine}`,
  fontFamily: vars.font.sans,
  fontSize: 17,
  color: vars.color.text,
  ':focus': {
    borderColor: vars.color.primary,
    boxShadow: '0 0 0 3px rgba(74, 106, 64, 0.18)',
    outline: 'none',
  },
  ':disabled': { color: vars.color.textMuted, cursor: 'not-allowed' },
});

export const picked = style({
  listStyle: 'none',
  margin: '8px 0 0',
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});
globalStyle(`${picked} li`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 4px 4px 16px',
  borderRadius: 999,
  background: vars.color.oliveWash,
  fontSize: fontSize.body,
  color: vars.color.oliveInk,
});
globalStyle(`${picked} button`, {
  display: 'grid',
  placeItems: 'center',
  width: 32,
  height: 32,
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'none',
  color: 'inherit',
  cursor: 'pointer',
});
globalStyle(`${picked} svg`, { width: 14, height: 14 });
export const formError = style({
  margin: '0 0 16px',
  padding: '8px 16px',
  borderRadius: 8,
  background: vars.color.rustWash,
  color: vars.color.error,
  fontSize: 15,
  fontWeight: 500,
});

export const search = style({ position: 'relative' });
globalStyle(`${search} svg`, {
  position: 'absolute',
  left: 16,
  bottom: 16,
  width: 16,
  height: 16,
  color: vars.color.textMuted,
  pointerEvents: 'none',
});
globalStyle(`${search} input`, { paddingLeft: 40 });
export const picker = style({
  margin: '16px 0 0',
  padding: 0,
  border: 0,
  minWidth: 0,
});
globalStyle(`${picker} ul`, {
  listStyle: 'none',
  margin: 0,
  padding: '4px 0',
  maxHeight: 280,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  borderBlock: `1px solid ${vars.color.border}`,
});
globalStyle(`${picker} label`, {
  display: 'grid',
  gridTemplateColumns: '20px minmax(0, 1fr)',
  columnGap: 16,
  alignItems: 'baseline',
  padding: '8px 2px',
  cursor: 'pointer',
});
globalStyle(`${picker} input`, {
  margin: 0,
  alignSelf: 'center',
  gridRow: '1 / span 2',
  accentColor: vars.color.primary,
});
export const pickTitle = style({ fontWeight: 500, overflowWrap: 'break-word' });
export const pickAuthor = style({
  gridColumn: 2,
  fontSize: fontSize.meta,
  color: vars.color.textSecondary,
});

export const status = style({
  minHeight: 24,
  margin: `${space.sp5} 0 0`,
  fontSize: fontSize.body,
  color: vars.color.textSecondary,
});

export { srOnly } from '../../styles/global.css';
