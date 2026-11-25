import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  band,
  bareButton,
  caps,
  coarse,
  easeOut,
  easeSoft,
  fill,
  focusRing,
  forcedColors,
  goldBand,
  hover,
  phone,
  pressed,
  reducedMotion,
} from '../../styles/global.css';

const fillOn = `color-mix(in srgb, ${vars.color.text} 14%, ${vars.color.background})`;

export { srOnly } from '../../styles/global.css';

/* ---------- the title: left over the map; centred while the atlas is blank ---------- */
export const viewHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp1} ${space.sp4}`,
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginBottom: space.sp5,
  selectors: {
    '&[data-blank]': { justifyContent: 'center', textAlign: 'center' },
  },
});
export const title = style({
  display: 'inline-flex',
  gap: space.sp4,
  alignItems: 'center',
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: 'clamp(30px, 3.2vw, 40px)',
  fontWeight: 500,
  lineHeight: 1.1,
  letterSpacing: '-0.01em',
  textWrap: 'balance',
});
export const titleIcon = style({
  flex: 'none',
  width: '1em',
  height: '1em',
  color: vars.color.textSecondary,
});

export const firstRun = style({
  margin: `calc(${space.sp2} * -1) 0 ${space.sp5}`,
  textAlign: 'center',
});

globalStyle(`${firstRun} p`, {
  maxWidth: '56ch',
  margin: '0 auto',
  color: vars.color.textSecondary,
  fontSize: fontSize.action,
});

/* ---------- the plate, and its full screen ---------- */
export const plate = style({
  position: 'relative',
  selectors: {
    '&[data-full]': {
      position: 'fixed',
      inset: 0,
      zIndex: 85,
      display: 'flex',
      flexDirection: 'column',
      gap: space.sp3,
      justifyContent: 'center',
      overflow: 'auto',
      overscrollBehavior: 'contain',
      padding: space.sp6,
      background: vars.color.background,
    },
  },
  '@media': {
    [phone]: {
      selectors: {
        '&[data-full]': { padding: `${space.sp6} ${space.sp3} ${space.sp3}` },
      },
    },
  },
});
// anywhere but a marked country (which opens the Shelf) opens the full screen map
globalStyle(`${plate}:not([data-full]) .rsm-svg`, { cursor: 'zoom-in' });
// above the map's top edge, level with the page title, so it never covers land
export const fullBtn = style({
  position: 'absolute',
  right: 0,
  bottom: 'calc(100% + 8px)',
  zIndex: 3,
  display: 'grid',
  placeItems: 'center',
  width: 40,
  height: 40,
  border: 0,
  borderRadius: '50%',
  background: fill,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: {
    [`${plate}[data-full] &`]: {
      position: 'fixed',
      top: space.sp3,
      right: space.sp3,
      bottom: 'auto',
    },
  },
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: fillOn, color: vars.color.text } },
    },
  },
});
globalStyle(`${fullBtn} svg`, { width: 16, height: 16 });

/* ---------- the cartouche: over the empty South Pacific on wide screens, a strip under the map on phones ---------- */
export const cartouche = style({
  position: 'absolute',
  bottom: 14,
  left: 14,
  zIndex: 2,
  minWidth: 168,
  padding: `${space.sp2} ${space.sp4}`,
  border: '1px solid transparent', // the frame forced-colours mode keeps
  borderRadius: vars.radius.sm,
  background: goldBand,
  '@media': {
    [phone]: {
      position: 'static',
      display: 'flex',
      flexWrap: 'wrap',
      gap: `2px ${space.sp2}`,
      alignItems: 'baseline',
      margin: `${space.sp2} 0 2px`,
    },
  },
});
export const cartBig = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'baseline',
});

globalStyle(`${cartBig} b`, {
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: fontSize.numeral,
  fontWeight: 400,
  fontVariantNumeric: 'lining-nums tabular-nums',
  lineHeight: 0.95,
  letterSpacing: '-.01em',
});

export const cartOf = style({
  position: 'relative',
  borderRadius: vars.radius.xs,
  color: vars.color.textMuted,
  fontSize: fontSize.body,
  textDecoration: 'underline dotted 1px',
  textUnderlineOffset: 3,
  cursor: 'help',
  ':focus-visible': focusRing,
});
export const cartWhy = style({
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: 0,
  zIndex: 5,
  visibility: 'hidden',
  width: 'min(320px, calc(100vw - 48px))',
  padding: `${space.sp2} ${space.sp3}`,
  borderRadius: vars.radius.sm,
  background: vars.color.text,
  color: vars.color.background,
  opacity: 0,
  fontFamily: vars.font.sans,
  fontSize: fontSize.meta,
  lineHeight: 1.45,
  textDecoration: 'none',
  textWrap: 'pretty',
  transition: 'opacity .12s ease-out, visibility 0s linear .12s',
  selectors: {
    [`${cartOf}:is(:hover, :focus) &`]: {
      visibility: 'visible',
      opacity: 1,
      transition: 'opacity .12s ease-out, visibility 0s',
    },
  },
});
export const cartCap = style({
  ...caps,
  margin: '2px 0 0',
});
export const cartMeta = style({
  margin: `${space.sp2} 0 0`,
  paddingTop: space.sp2,
  borderTop: `1px solid ${vars.color.border}`,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
  fontVariantNumeric: 'lining-nums tabular-nums',
  '@media': { [phone]: { margin: '0 0 0 auto', paddingTop: 0, borderTop: 0 } },
});

/* ---------- the key and the Show filter ---------- */
export const legend = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: space.sp2,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
});
export const key = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  listStyle: 'none',
});

globalStyle(`${key} li`, {
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
});

const swatch = {
  flex: 'none',
  width: 11,
  height: 11,
  borderRadius: 2,
} as const;

export const swatchSet = style({ ...swatch, background: vars.color.olive });
export const swatchAuthor = style({
  ...swatch,
  background: vars.color.markerAuthor,
});
// the key draws what the map draws: both is the hatch
export const swatchBoth = style({
  ...swatch,
  background: `repeating-linear-gradient(45deg, ${vars.color.olive} 0 2px, ${vars.color.markerAuthor} 2px 4px)`,
});
export const showGroup = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  alignItems: 'center',
});
export const capsLabel = style({
  ...caps,
  marginRight: space.sp2,
});
// pills: a flat fill, no bolder weight when picked, so picking never shifts the neighbours
export const showBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  padding: `${space.sp2} ${space.sp4}`,
  border: '1px solid transparent',
  borderRadius: vars.radius.pill,
  background: fill,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: {
    '&[aria-pressed="true"]': {
      background: `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.background})`,
      color: vars.color.text,
    },
  },
  '@media': {
    [hover]: { selectors: { '&:hover': { background: fillOn } } },
    [coarse]: { minHeight: 44 },
    [forcedColors]: { borderColor: 'ButtonText' },
  },
});

/* ---------- sections: recent reads, countries ---------- */
export const section = style({ marginTop: space.sp6 });
export const subHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  alignItems: 'baseline',
  justifyContent: 'space-between',
  margin: `0 0 ${space.sp3}`,
});
export const h2 = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'baseline',
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
});
// the words set the row's baseline, so the link beside them shares it; the glyph centres on them
export const h2Icon = style({
  flex: 'none',
  alignSelf: 'center',
  width: 22,
  height: 22,
  color: vars.color.textSecondary,
});
export const more = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  minHeight: 40,
  color: vars.color.textSecondary,
  fontWeight: 500,
  textDecoration: 'none',
  ':focus-visible': focusRing,
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': { color: vars.color.text, textDecoration: 'underline' },
      },
    },
    [coarse]: { minHeight: 44 },
  },
});
globalStyle(`${more} svg`, { width: 15, height: 15 });
export const subNote = style({
  color: vars.color.textMuted,
  fontSize: fontSize.body,
  textWrap: 'pretty',
});

/* ---------- countries: a folded row per continent, a stamp per country ---------- */
export const cc = style({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${vars.color.border}`,
});
export const ccRow = style({
  display: 'block',
  borderTop: `1px solid ${vars.color.border}`,
});
export const ccSummary = style({
  display: 'flex',
  gap: space.sp3,
  alignItems: 'center',
  minHeight: 72,
  padding: `${space.sp2} 0`,
  listStyle: 'none',
  cursor: 'pointer',
  ':focus-visible': { ...focusRing, borderRadius: vars.radius.sm },
  '::before': {
    content: '""',
    flex: 'none',
    width: 8,
    height: 8,
    margin: `0 ${space.sp1}`,
    borderRight: `1.5px solid ${vars.color.textSecondary}`,
    borderBottom: `1.5px solid ${vars.color.textSecondary}`,
    rotate: '-45deg',
    transition: 'rotate .18s cubic-bezier(.2, .8, .25, 1)',
  },
  '@media': {
    [reducedMotion]: { '::before': { transition: 'none' } },
  },
});
globalStyle(`${ccRow}[open] > ${ccSummary}::before`, { rotate: '45deg' });
globalStyle(`${ccSummary}::-webkit-details-marker`, { display: 'none' });
export const ccTitle = style({
  display: 'flex',
  gap: space.sp3,
  alignItems: 'baseline',
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.15,
});
export const ccN = style({
  color: vars.color.textMuted,
  fontFamily: vars.font.serif,
  fontSize: fontSize.item,
  fontWeight: 400,
  fontVariantNumeric: 'lining-nums tabular-nums',
  whiteSpace: 'nowrap',
});
export const ccPeek = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  marginLeft: 'auto',
});
globalStyle(`${ccRow}[open] ${ccPeek}`, { display: 'none' });

// phones: three outlines are enough of a hint
globalStyle(`${ccPeek} svg:nth-child(n+4)`, {
  '@media': { [phone]: { display: 'none' } },
});

export const ccMore = style({
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
  fontVariantNumeric: 'tabular-nums',
  '@media': { [phone]: { display: 'none' } },
});

export const ccStamps = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(184px, 1fr))',
  gap: space.sp4,
  padding: `0 0 ${space.sp4}`,
  listStyle: 'none',
  '@media': {
    [phone]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: space.sp2,
    },
  },
});
export const ccStamp = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  height: '100%',
  padding: space.sp4,
  borderRadius: vars.radius.lg,
  background: goldBand,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  textAlign: 'left',
  textDecoration: 'none',
  ':focus-visible': focusRing,
  '@media': {
    [hover]: {
      transition: 'background-color .15s ease-out',
      selectors: {
        '&:hover': {
          background: `color-mix(in srgb, ${vars.color.secondary} 18%, ${vars.color.background})`,
        },
      },
    },
    [phone]: { padding: `${space.sp4} ${space.sp2}` },
  },
});
export const ccShape = style({
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  height: 80,
  marginBottom: space.sp4,
  '@media': { [phone]: { height: 70 } },
});

globalStyle(`${ccShape} svg`, {
  '@media': { [phone]: { width: 112, height: 70 } },
});

export const ccName = style({
  fontFamily: vars.font.serif,
  fontSize: fontSize.item,
  fontWeight: 500,
  lineHeight: 1.2,
  overflowWrap: 'break-word',
});
export const ccWhat = style({
  marginTop: space.sp1,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
});
// the stamp's country wears its mark from the map, with no outline
export const shapeSet = style({ fill: vars.color.olive });
export const shapeAuthor = style({ fill: vars.color.markerAuthor });

/* ---------- the map's tip: a marked country's books, or what a click on an unmarked one does ---------- */
// a floating layer keeps a thin edge in place of a blurred shadow
export const tip = style({
  position: 'fixed',
  zIndex: 90,
  width: 'max-content',
  maxWidth: 300,
  padding: `${space.sp4} ${space.sp4} ${space.sp2}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: fontSize.meta,
  lineHeight: 1.35,
  pointerEvents: 'none',
});
export const tipHead = style({
  display: 'flex',
  gap: space.sp4,
  alignItems: 'baseline',
  justifyContent: 'space-between',
});

globalStyle(`${tipHead} b`, {
  fontFamily: vars.font.serif,
  fontSize: fontSize.item,
  fontWeight: 500,
});

globalStyle(`${tipHead} span`, {
  color: vars.color.textMuted,
  fontSize: fontSize.label,
  whiteSpace: 'nowrap',
});

export const tipHeadBooks = style({
  paddingBottom: space.sp2,
  borderBottom: `1px solid ${vars.color.border}`,
});
export const tipList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp2,
  padding: `${space.sp2} 0 0`,
  listStyle: 'none',
});

globalStyle(`${tipList} li`, {
  display: 'flex',
  gap: space.sp2,
  alignItems: 'flex-start',
});

export const tipBook = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  color: vars.color.textSecondary,
});
export const tipTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: fontSize.body,
  lineHeight: 1.2,
});
export const tipWhy = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  marginTop: 2,
  color: vars.color.textMuted,
  fontSize: fontSize.label,
});
globalStyle(`${tipWhy} i`, { width: 8, height: 8 });
export const tipFoot = style({
  margin: `${space.sp1} 0 0`,
  color: vars.color.textMuted,
  fontSize: fontSize.label,
});
export const tipFootRule = style({
  marginTop: space.sp2,
  paddingTop: space.sp2,
  borderTop: `1px solid ${vars.color.border}`,
});

/* ---------- the pin moment: a pin flies from Log a book to each new country, the count ticks ---------- */
export const flyPin = style({
  position: 'fixed',
  zIndex: 90,
  width: 32,
  height: 32,
  pointerEvents: 'none',
});

globalStyle(`${flyPin} svg`, {
  display: 'block',
  width: '100%',
  height: '100%',
});

globalStyle(`${flyPin} path`, {
  fill: vars.color.text,
  stroke: vars.color.surface,
  strokeWidth: 1.4,
});

globalStyle(`${flyPin} circle`, { fill: vars.color.secondaryBright });
export const landRing = style({
  position: 'fixed',
  zIndex: 89,
  width: 32,
  height: 32,
  border: `2px solid ${vars.color.secondary}`,
  borderRadius: '50%',
  pointerEvents: 'none',
});

const tickIn = keyframes({
  '0%': { color: vars.color.secondary, translate: '0 -3px' },
  '100%': { translate: '0 0' },
});

export const ticked = style({
  display: 'inline-block',
  animation: `${tickIn} .6s ${easeSoft} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});
// the line said when the pins land, on the map's southern edge so the page never reflows
export const atlasStatus = style({
  position: 'absolute',
  right: 16,
  bottom: 16,
  zIndex: 3,
  maxWidth: 'min(60%, 520px)',
  padding: `${space.sp2} ${space.sp4}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  fontSize: fontSize.body,
  fontWeight: 500,
  '@media': {
    [phone]: {
      top: 8,
      right: 8,
      bottom: 'auto',
      left: 8,
      maxWidth: 'none',
      fontSize: fontSize.meta,
    },
  },
});

/* ---------- Beyond the map: imagined worlds, under the map ---------- */
export const beyond = style({
  marginTop: space.sp2,
  padding: `${space.sp4} ${space.sp5}`,
  borderRadius: vars.radius.sm,
  background: band,
});
export const beyondLabel = style({
  ...caps,
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  width: 'fit-content',
  minHeight: 40,
  fontWeight: 500,
  listStyle: 'none',
  cursor: 'pointer',
  ':focus-visible': focusRing,
  '::before': {
    content: '""',
    width: 7,
    height: 7,
    marginRight: 2,
    borderRight: '1.5px solid currentColor',
    borderBottom: '1.5px solid currentColor',
    rotate: '-45deg',
    transition: `rotate .2s ${easeOut}`,
  },
  selectors: {
    '&::-webkit-details-marker': { display: 'none' },
    [`${beyond}[open] > &::before`]: { rotate: '45deg' },
  },
  '@media': {
    [hover]: { selectors: { '&:hover': { color: vars.color.text } } },
    [coarse]: { minHeight: 44 },
    [reducedMotion]: { selectors: { '&::before': { transition: 'none' } } },
  },
});
export const beyondSum = style({
  fontSize: fontSize.meta,
  fontWeight: 400,
  fontVariantNumeric: 'lining-nums tabular-nums',
  letterSpacing: 0,
  textTransform: 'none',
});
export const beyondBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp4,
  marginTop: space.sp4,
});
export const beyondList = style({
  borderTop: `1px solid ${vars.color.border}`,
  listStyle: 'none',
});
export const worldRow = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  borderBottom: `1px solid ${vars.color.border}`,
});
export const worldOpen = style({
  ...bareButton,
  display: 'flex',
  flex: 1,
  gap: space.sp2,
  alignItems: 'baseline',
  minHeight: 44,
  padding: `${space.sp2} ${space.sp1}`,
  textAlign: 'left',
  ':focus-visible': { ...focusRing, borderRadius: vars.radius.sm },
});
export const worldName = style({
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: fontSize.item,
  selectors: { '&[data-saved]': { color: vars.color.textSecondary } },
  '@media': {
    [hover]: {
      selectors: {
        [`${worldOpen}:hover &`]: {
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        },
      },
    },
  },
});
export const beyondN = style({
  marginLeft: 'auto',
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
  fontVariantNumeric: 'lining-nums tabular-nums',
});
export const beyondRm = style({
  display: 'grid',
  flex: 'none',
  placeItems: 'center',
  width: 32,
  height: 32,
  border: 0,
  borderRadius: '50%',
  background: 'none',
  color: vars.color.textSecondary,
  transition: `scale .16s ${easeOut}`,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  ':active': pressed,
  '@media': {
    [hover]: { selectors: { '&:hover': { background: fill } } },
    [coarse]: { width: 44, height: 44 },
  },
});
globalStyle(`${beyondRm} svg`, { width: 16, height: 16 });
export const beyondAdd = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  alignItems: 'center',
});

globalStyle(`${beyondAdd} input`, {
  width: 184,
  minHeight: 40,
  padding: `${space.sp1} ${space.sp4}`,
  border: `1.5px solid ${vars.color.fieldLine}`,
  borderRadius: vars.radius.pill,
  background: vars.color.field,
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: fontSize.body,
  '@media': {
    [phone]: { flex: 1, width: 'auto' },
    [coarse]: { minHeight: 44 },
  },
});

globalStyle(`${beyondAdd} input:focus`, {
  borderColor: vars.color.accent,
  outline: 'none',
});

export const beyondBtn = style([
  more,
  {
    padding: 0,
    border: 0,
    background: 'none',
    fontFamily: vars.font.sans,
    fontSize: fontSize.body,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
]);

/* ---------- a world's books, in a dialog ---------- */
export const worldSub = style({
  margin: '2px 0 0',
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
});
export const worldBooks = style({
  maxHeight: 'min(380px, 50vh)',
  overflowY: 'auto',
  borderTop: `1px solid ${vars.color.border}`,
  listStyle: 'none',
});

globalStyle(`${worldBooks} li`, {
  display: 'flex',
  gap: space.sp4,
  alignItems: 'center',
  padding: `${space.sp4} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
});

globalStyle(`${worldBooks} li > div`, {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  minWidth: 0,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
});

globalStyle(`${worldBooks} time`, { color: vars.color.textMuted });

// the first-run invitation's button sits a step below its line
export const cta = style({ marginTop: space.sp4 });
