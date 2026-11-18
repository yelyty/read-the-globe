import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  easeOut,
  easeSoft,
  focusRing,
  forcedColors,
  goldBand,
  hover,
  phone,
  reducedMotion,
} from '../../styles/global.css';
import { formError as fieldFormError } from '../../components/Field/Field.css';

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

export const yours = style({ marginTop: space.sp7 });

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

export const addGoal = style({}); // suggestions first: the page opens on somewhere new to aim at

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
  margin: `${space.sp4} 0 ${space.sp5}`,
  padding: 0,
  display: 'grid',
  gap: space.sp4,
  gridTemplateColumns: 'repeat(auto-fit, minmax(208px, 1fr))',
});
export const dest = style({
  ...press,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  height: '100%',
  padding: space.sp4,
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
  marginBottom: space.sp4,
});
export const destName = style({
  fontFamily: vars.font.serif,
  fontWeight: 500,
  fontSize: fontSize.heading,
  lineHeight: 1.15,
  textWrap: 'balance',
});
export const destNote = style({
  marginTop: space.sp1,
  fontSize: fontSize.meta,
  color: vars.color.textSecondary,
  fontVariantNumeric: 'tabular-nums',
});
export const destAdd = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sp2,
  marginTop: 'auto',
  paddingTop: space.sp4,
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.accent,
});
globalStyle(`${destAdd} svg`, { width: 14, height: 14 });

export const more = style({ marginTop: 0 });

globalStyle(`${more} > summary`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sp2,
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
export const group = style({ marginTop: space.sp4 });

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
  gap: space.sp2,
  minHeight: 40,
  padding: `${space.sp2} ${space.sp4} ${space.sp2} ${space.sp2}`,
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
  marginLeft: space.sp1,
  fontSize: fontSize.meta,
  color: vars.color.textMuted,
});

// no goals yet: the sticker sits below a hairline, where the goals will be
export const empty = style({
  marginTop: space.sp7,
  borderTop: `1px solid ${vars.color.border}`,
  // the hairline runs the page's width, the words stay centred in EmptyState's column
  selectors: { '&&': { maxWidth: 'none' } },
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
export const goalArriving = style({});
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
  gap: space.sp4,
  minWidth: 0,
});
export const goalName = style({
  margin: 0,
  // a goal just added gets focus on its name, shown as an underline rather than a box round the title
  ':focus': { outline: 'none' },
  ':focus-visible': {
    textDecoration: `underline 2px ${vars.color.accent}`,
    textUnderlineOffset: 5,
  },
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.2,
  overflowWrap: 'break-word',
});
export const goalMeta = style({
  margin: `${space.sp1} 0 0`,
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
  gap: space.sp1,
  marginTop: space.sp1,
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
  gap: space.sp2,
  minHeight: 40,
  cursor: 'pointer',
  listStyle: 'none',
  fontWeight: 500,
});

globalStyle(`${goalTodo} summary::-webkit-details-marker`, { display: 'none' });
globalStyle(`${goalTodo} summary::before`, caret(7));
globalStyle(`${goalTodo}[open] summary::before`, { rotate: '45deg' });

globalStyle(`${goalTodo} p`, {
  margin: `${space.sp1} 0 0`,
  lineHeight: 1.5,
  maxWidth: '62ch',
});

globalStyle(`${goalTodo} b`, { fontWeight: 500, color: vars.color.text });
export const goalActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: space.sp4,
  marginLeft: 'auto',
});
// Choose books on the left; Edit and Remove goal together on the right
export const chooseBtn = style({ marginRight: 'auto' });
globalStyle(`${goalActions}:has(${chooseBtn})`, { flex: 1, marginLeft: 0 });

/* ---------- the road to the flag ---------- */
export const route = style({
  position: 'relative',
  height: 24,
  marginTop: space.sp4,
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
  marginTop: `calc(${space.sp1} * -1)`,
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
export const field = style({ marginBottom: space.sp4 });
export const label = style({
  display: 'block',
  marginBottom: space.sp2,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.2,
  color: vars.color.textSecondary,
});
export const input = style({
  width: '100%',
  height: 48,
  padding: `0 ${space.sp4}`,
  borderRadius: 12,
  background: vars.color.background,
  border: `1.5px solid ${vars.color.fieldLine}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.item,
  color: vars.color.text,
  ':focus': {
    borderColor: vars.color.primary,
    boxShadow: '0 0 0 3px rgba(74, 106, 64, 0.18)',
    outline: 'none',
  },
  ':disabled': { color: vars.color.textMuted, cursor: 'not-allowed' },
  selectors: { '&[aria-invalid="true"]': { borderColor: vars.color.error } },
});

export const picked = style({
  listStyle: 'none',
  margin: `${space.sp2} 0 0`,
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
});

globalStyle(`${picked} li`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sp1,
  padding: `${space.sp1} ${space.sp1} ${space.sp1} ${space.sp4}`,
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
export const formError = style([
  fieldFormError,
  { margin: `0 0 ${space.sp4}` },
]);

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

globalStyle(`${search} input`, { paddingLeft: space.sp7 });
export const picker = style({
  margin: `${space.sp4} 0 0`,
  padding: 0,
  border: 0,
  minWidth: 0,
});

globalStyle(`${picker} ul`, {
  listStyle: 'none',
  margin: 0,
  padding: `${space.sp1} 0`,
  maxHeight: 280,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  borderBlock: `1px solid ${vars.color.border}`,
});

globalStyle(`${picker} label`, {
  display: 'grid',
  gridTemplateColumns: '20px minmax(0, 1fr)',
  columnGap: space.sp4,
  alignItems: 'baseline',
  padding: `${space.sp2} 2px`,
  cursor: 'pointer',
});

// the checkbox sits centred beside the title and author
export const pickBox = style({ alignSelf: 'center', gridRow: '1 / span 2' });

export const pickTitle = style({ fontWeight: 500, overflowWrap: 'break-word' });
export const pickAuthor = style({
  gridColumn: 2,
  fontSize: fontSize.meta,
  color: vars.color.textSecondary,
});

export { srOnly } from '../../styles/global.css';

/* ---------- the reached stamp: a green postmark pressed over the plate's top-right corner ---------- */
export const stamp = style({
  position: 'absolute',
  zIndex: 2,
  top: -20,
  right: -8,
  width: 132,
  height: 88,
  rotate: '-12deg',
  overflow: 'visible',
  pointerEvents: 'none',
  '@media': { [phone]: { width: 84, height: 56, top: -12, right: -2 } },
});
export const pmRing = style({
  fill: 'none',
  stroke: vars.color.accent,
  strokeWidth: 1.1,
});
export const pmRingOut = style({
  fill: vars.color.surface,
  fillOpacity: 0.82,
  strokeWidth: 2.2,
});
export const pmWave = style({
  fill: 'none',
  stroke: vars.color.accent,
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  opacity: 0.85,
});
export const pmArc = style({
  fontFamily: vars.font.sans,
  fontSize: 8.4,
  fontWeight: 700,
  fill: vars.color.accent,
});
export const pmFlag = style({
  fill: 'none',
  stroke: vars.color.accent,
  strokeWidth: 1.4,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
});
export const pmDate = style({
  fontFamily: vars.font.serif,
  fontSize: 10.5,
  fontWeight: 600,
  fill: vars.color.accent,
});

/* ---------- the arrival: the pin runs the last stretch, the flag rises and catches gold, the count ticks once,
   the stamp lands; then gold leaves. Once per goal reached; GoalsPage leaves it off under reduced motion. ---------- */
const arriveFill = keyframes({
  from: { transform: 'scaleX(.8)' },
  to: { transform: 'scaleX(1)' },
});

const arrivePin = keyframes({
  '0%': { left: 'calc(.8 * (100% - 16px))', opacity: 1 },
  '70%': { left: 'calc(100% - 16px)', opacity: 1 },
  '100%': { left: 'calc(100% - 16px)', opacity: 0 },
});

const arriveFlag = keyframes({
  '0%, 55%': { transform: 'translateY(-84%) scale(1)' },
  '75%': { transform: 'translateY(-104%) scale(1.45)' },
  '100%': { transform: 'translateY(-92%) scale(1.3)' },
});

const flagGold = keyframes({
  '0%, 55%': { fill: vars.color.text },
  '72%': { fill: vars.color.secondary },
  '100%': { fill: vars.color.text },
});

const poleGold = keyframes({
  '0%, 55%': { stroke: vars.color.text },
  '72%': { stroke: vars.color.secondary },
  '100%': { stroke: vars.color.text },
});

const tick = keyframes({
  '0%': { color: vars.color.secondary, translate: '0 -3px' },
  '100%': { color: 'inherit', translate: '0 0' },
});

const doneIn = keyframes({
  from: { opacity: 0, translate: '0 3px' },
  to: { opacity: 1, translate: '0 0' },
});

const stampIn = keyframes({
  from: { opacity: 0, scale: '1.6', rotate: '-26deg' },
  '60%': { opacity: 1, scale: '.9', rotate: '-8deg' },
  '80%': { scale: '1.04' },
  to: { opacity: 1, scale: '1', rotate: '-12deg' },
});

const arrive = (name: string, ms: number, delay: number) =>
  `${name} ${ms}ms ${easeSoft} ${delay}ms both`;

globalStyle(`${goalArriving} ${routeFill}`, {
  animation: arrive(arriveFill, 800, 150),
});

globalStyle(`${goalArriving} ${routePin}`, {
  animation: arrive(arrivePin, 1100, 150),
});

globalStyle(`${goalArriving} ${routeFlag}`, {
  animation: arrive(arriveFlag, 1400, 150),
});

globalStyle(`${goalArriving} ${flagCloth}`, {
  animation: `${flagGold} 2.2s ease .15s both`,
});

globalStyle(`${goalArriving} ${flagPole}`, {
  animation: `${poleGold} 2.2s ease .15s both`,
});

globalStyle(`${goalArriving} ${goalCount} b`, {
  display: 'inline-block',
  animation: arrive(tick, 600, 1000),
});

globalStyle(`${goalArriving} ${goalReached}`, {
  animation: arrive(doneIn, 500, 1100),
});

globalStyle(`${goalArriving} ${stamp}`, {
  animation: arrive(stampIn, 450, 1100),
});

// Make your own goal sits a step below the suggestions
export const addOwn = style({ marginTop: space.sp4 });
