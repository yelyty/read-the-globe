import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  caps,
  easeOut,
  easeSoft,
  fieldFocus,
  focusRing,
  forcedColors,
  goldBand,
  hover,
  phone,
  pressed,
  reducedMotion,
} from '../../styles/global.css';
import { formError as fieldFormError } from '../../components/Field/Field.css';

const press = {
  transition: `scale 160ms ${easeOut}, background-color 160ms ${easeOut}`,
  selectors: { '&:not(:disabled):active': pressed },
};

const caret = (size: number) => ({
  content: '""',
  flex: 'none',
  width: size,
  height: size,
  borderRight: `${size > 8 ? 2 : 1.5}px solid ${vars.color.textMuted}`,
  borderBottom: `${size > 8 ? 2 : 1.5}px solid ${vars.color.textMuted}`,
  rotate: '-45deg',
  transition: `rotate .18s ${easeOut}`,
});

export const h2 = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.2,
});

const foldSummary = {
  display: 'flex',
  gap: space.sp4,
  alignItems: 'center',
  minHeight: 40,
  listStyle: 'none',
  cursor: 'pointer',
} as const;

export const yours = style({ marginTop: space.sp7 });

globalStyle(`${yours} > summary`, {
  ...foldSummary,
  marginBottom: space.sp5,
  paddingBottom: space.sp2,
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
  borderRadius: vars.radius.sm,
  background: goldBand,
});

globalStyle(`${pick} p`, {
  margin: `0 0 ${space.sp3}`,
  color: vars.color.text,
});

globalStyle(`${pick} b`, { fontWeight: 500 });

export const full = style({
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  fontWeight: 500,
});

export const dests = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(208px, 1fr))',
  gap: space.sp4,
  margin: `${space.sp4} 0 ${space.sp5}`,
  listStyle: 'none',
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
  borderRadius: vars.radius.lg,
  background: goldBand,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  textAlign: 'left',
  cursor: 'pointer',
  ':focus-visible': focusRing,
  ':disabled': { opacity: 0.55, cursor: 'default' },
});
export const destMap = style({
  display: 'block',
  width: '100%',
  marginBottom: space.sp4,
});
export const destName = style({
  fontFamily: vars.font.serif,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.15,
  textWrap: 'balance',
});
export const destNote = style({
  marginTop: space.sp1,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
  fontVariantNumeric: 'tabular-nums',
});
export const destAdd = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: space.sp4,
  color: vars.color.accent,
  fontSize: fontSize.body,
  fontWeight: 500,
});
globalStyle(`${destAdd} svg`, { width: 14, height: 14 });

export const more = style({ marginTop: 0 });

globalStyle(`${more} > summary`, {
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  minHeight: 40,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  fontWeight: 500,
  listStyle: 'none',
  cursor: 'pointer',
});

globalStyle(`${more} > summary::-webkit-details-marker`, { display: 'none' });
globalStyle(`${more} > summary::before`, caret(7));
globalStyle(`${more}[open] > summary::before`, { rotate: '45deg' });
export const moreN = style({ fontWeight: 400 });
export const group = style({ marginTop: space.sp4 });

globalStyle(`${group} h3`, {
  ...caps,
  margin: `0 0 ${space.sp2}`,
  fontFamily: vars.font.sans,
  fontWeight: 500,
});

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  listStyle: 'none',
});
export const chip = style({
  ...press,
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  minHeight: 40,
  padding: `${space.sp2} ${space.sp4} ${space.sp2} ${space.sp2}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
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
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
});

// no goals yet: the sticker sits below a hairline, where the goals will be
export const empty = style({
  marginTop: space.sp7,
  borderTop: `1px solid ${vars.color.border}`,
  // the hairline runs the page's width, the words stay centred in EmptyState's column
  selectors: { '&&': { maxWidth: 'none' } },
});

export const goalList = style({
  display: 'grid',
  gap: space.sp6,
  listStyle: 'none',
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
  borderRadius: vars.radius.sm,
  background: vars.map.sea,
});

globalStyle(`${goal} ${plate}`, {
  width: 176,
  '@media': { [phone]: { width: 96 } },
});

globalStyle(`${plate} path`, {
  stroke: vars.color.border,
  strokeWidth: 0.6,
  vectorEffect: 'non-scaling-stroke',
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
  right: 11,
  bottom: 10,
  zIndex: 1,
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
  gap: space.sp4,
  alignItems: 'baseline',
  justifyContent: 'space-between',
  minWidth: 0,
});
export const goalName = style({
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.2,
  overflowWrap: 'break-word',
  // a goal just added gets focus on its name, shown as an underline rather than a box round the title
  ':focus': { outline: 'none' },
  ':focus-visible': {
    textDecoration: `underline 2px ${vars.color.accent}`,
    textUnderlineOffset: 5,
  },
});
export const goalMeta = style({
  margin: `${space.sp1} 0 0`,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
});
export const goalCount = style({
  flex: 'none',
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',
  whiteSpace: 'nowrap',
});

globalStyle(`${goalCount} b`, {
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: fontSize.numerals,
  fontWeight: 400,
});

export const goalPct = style({});
export const goalReached = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp1,
  alignItems: 'flex-end',
  marginTop: space.sp1,
  color: vars.color.oliveInk,
  fontSize: fontSize.label,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  '@media': { [phone]: { textAlign: 'right', whiteSpace: 'normal' } },
});
export const goalPast = style({
  color: vars.color.textMuted,
  letterSpacing: 1,
});

export const goalFoot = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginTop: space.sp2,
  '@media': { [phone]: { gridColumn: '1 / -1' } },
});
export const goalTodo = style({
  flex: '1 1 auto',
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
});

globalStyle(`${goalTodo} summary`, {
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  minHeight: 40,
  fontWeight: 500,
  listStyle: 'none',
  cursor: 'pointer',
});

globalStyle(`${goalTodo} summary::-webkit-details-marker`, { display: 'none' });
globalStyle(`${goalTodo} summary::before`, caret(7));
globalStyle(`${goalTodo}[open] summary::before`, { rotate: '45deg' });

globalStyle(`${goalTodo} p`, {
  maxWidth: '62ch',
  margin: `${space.sp1} 0 0`,
  lineHeight: 1.5,
});

globalStyle(`${goalTodo} b`, { color: vars.color.text, fontWeight: 500 });
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
const road = { position: 'absolute', top: '50%', right: 16, left: 0 } as const;

export const routeTrack = style({
  ...road,
  height: 3,
  marginTop: -1,
  borderRadius: vars.radius.pill,
  background: vars.color.border,
});
const fillIn = keyframes({ from: { transform: 'scaleX(0)' } });

export const routeFill = style({
  ...road,
  zIndex: 1,
  height: 7,
  marginTop: `calc(${space.sp1} * -1)`,
  borderRadius: vars.radius.pill,
  background: vars.color.primary,
  transform: 'scaleX(var(--p))',
  transformOrigin: 'left center',
  animation: `${fillIn} .6s ${easeOut}`,
  selectors: { [`${routeTheme} &`]: { background: vars.color.textMuted } },
  '@media': {
    [reducedMotion]: { animation: 'none' },
    [forcedColors]: {
      background: 'CanvasText',
      forcedColorAdjust: 'none',
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
  top: 0,
  left: 'calc(var(--k) * 100%)',
  width: 12,
  height: 12,
  borderRadius: '50%',
  boxShadow: `inset 0 0 0 2px ${vars.color.textMuted}`,
  background: vars.color.background,
  translate: '-50% -50%',
});
export const stopHit = style([
  stop,
  {
    boxShadow: `0 0 0 2px ${vars.color.background}`,
    background: vars.color.primary,
  },
]);
export const routePin = style({
  position: 'absolute',
  top: '50%',
  left: 'calc(var(--p) * (100% - 16px))',
  zIndex: 3,
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
  top: '50%',
  right: 0,
  zIndex: 3,
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
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.2,
});
export const input = style({
  width: '100%',
  height: 48,
  padding: `0 ${space.sp4}`,
  border: `1.5px solid ${vars.color.fieldLine}`,
  borderRadius: vars.radius.md,
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.item,
  ':focus': fieldFocus,
  ':disabled': { color: vars.color.textMuted, cursor: 'not-allowed' },
  selectors: { '&[aria-invalid="true"]': { borderColor: vars.color.error } },
});

export const picked = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  margin: `${space.sp2} 0 0`,
  listStyle: 'none',
});

globalStyle(`${picked} li`, {
  display: 'inline-flex',
  gap: space.sp1,
  alignItems: 'center',
  padding: `${space.sp1} ${space.sp1} ${space.sp1} ${space.sp4}`,
  borderRadius: vars.radius.pill,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  fontSize: fontSize.body,
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
  bottom: 16,
  left: 16,
  width: 16,
  height: 16,
  color: vars.color.textMuted,
  pointerEvents: 'none',
});

globalStyle(`${search} input`, { paddingLeft: space.sp7 });
export const picker = style({
  minWidth: 0,
  margin: `${space.sp4} 0 0`,
  border: 0,
});

globalStyle(`${picker} ul`, {
  maxHeight: 280,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  margin: 0,
  padding: `${space.sp1} 0`,
  borderBlock: `1px solid ${vars.color.border}`,
  listStyle: 'none',
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
export const pickBox = style({ gridRow: '1 / span 2', alignSelf: 'center' });

export const pickTitle = style({ fontWeight: 500, overflowWrap: 'break-word' });
export const pickAuthor = style({
  gridColumn: 2,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
});

export { srOnly } from '../../styles/global.css';

/* ---------- the reached stamp: a green postmark pressed over the plate's top-right corner ---------- */
export const stamp = style({
  position: 'absolute',
  top: -20,
  right: -8,
  zIndex: 2,
  width: 132,
  height: 88,
  overflow: 'visible',
  rotate: '-12deg',
  pointerEvents: 'none',
  '@media': { [phone]: { top: -12, right: -2, width: 84, height: 56 } },
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
  fill: vars.color.accent,
  fontFamily: vars.font.sans,
  fontSize: 8.4,
  fontWeight: 700,
});
export const pmFlag = style({
  fill: 'none',
  stroke: vars.color.accent,
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});
export const pmDate = style({
  fill: vars.color.accent,
  fontFamily: vars.font.serif,
  fontSize: 10.5,
  fontWeight: 600,
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
  from: { opacity: 0, rotate: '-26deg', scale: '1.6' },
  '60%': { opacity: 1, rotate: '-8deg', scale: '.9' },
  '80%': { scale: '1.04' },
  to: { opacity: 1, rotate: '-12deg', scale: '1' },
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
