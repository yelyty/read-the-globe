import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  band,
  easeOut,
  hatch,
  motionOk,
  narrow,
} from '../../../../styles/global.css';

/* the product, straight under the hero: --z and --tilt come from the scroll (LiveAtlas.tsx) */
export const frame = style({
  width: 'min(1120px, 100% - 32px)',
  margin: '0 auto',
  padding: space.sp2,
  borderRadius: 24, // concentric: the 16px sheet + 8px padding
  background: band,
  transform: 'perspective(1600px) rotateX(var(--tilt, 0deg))',
  transformOrigin: '50% 0',
  scale: 'var(--z, 1)',
});

export const sheet = style({
  padding: `${space.sp5} ${space.sp6}`,
  borderRadius: vars.radius.lg,
  background: vars.color.background,
  '@media': { [narrow]: { padding: space.sp4 } },
});

export const head = style({
  display: 'flex',
  gap: space.sp4,
  alignItems: 'baseline',
  justifyContent: 'space-between',
});
export const title = style({
  fontFamily: vars.font.serif,
  fontSize: 'clamp(24px, 2.6vw, 34px)',
  fontWeight: 500,
  lineHeight: 1.1,
});
export const tag = style({
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1,
});

export const map = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  overflow: 'visible',
  marginTop: space.sp4,
});

// no outlines on the countries: the marks are fills, and both is the olive/rust hatch
export const land = style({
  fill: vars.color.backgroundDeep,
  fillOpacity: 0.42,
  transition: `fill-opacity .35s ${easeOut}`,
});
export const set = style({ fill: vars.color.olive });
export const author = style({ fill: vars.color.markerAuthor });
export const both = style({ fill: 'url(#al-hatch)' });

const pingOut = keyframes({
  from: { opacity: 0.9, scale: '.3' },
  to: { opacity: 0, scale: '1.6' },
});

export const ping = style({
  fill: 'none',
  stroke: vars.color.text,
  strokeWidth: 1.6,
  vectorEffect: 'non-scaling-stroke',
  opacity: 0,
  transformOrigin: 'center',
  transformBox: 'fill-box',
  '@media': {
    [motionOk]: {
      animation: `${pingOut} .6s ${easeOut}`,
    },
  },
});

export const foot = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  gap: `${space.sp2} ${space.sp5}`,
  alignItems: 'end',
  marginTop: space.sp4,
  '@media': { [narrow]: { gridTemplateColumns: 'auto 1fr' } },
});

export const count = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'baseline',
});

globalStyle(`${count} b`, {
  minWidth: '2ch',
  fontFamily: vars.font.serif,
  fontSize: 'clamp(40px, 4.4vw, 56px)',
  fontWeight: 400,
  fontVariantNumeric: 'lining-nums tabular-nums',
  lineHeight: 1,
});

globalStyle(`${count} span`, {
  color: vars.color.textSecondary,
  fontSize: fontSize.heading,
  lineHeight: 1,
});

globalStyle(`${count} em`, {
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.meta,
  fontWeight: 500,
  fontStyle: 'normal',
  lineHeight: 1,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
});

export const now = style({
  display: 'flex',
  alignItems: 'end',
  minHeight: '2.7em',
  color: vars.color.textSecondary,
  fontSize: fontSize.action,
  lineHeight: 1.35,
  textWrap: 'balance',
  '@media': { [narrow]: { gridColumn: '1 / -1', gridRow: 2, minHeight: 0 } },
});

export const books = style({
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1,
  '@media': { [narrow]: { justifySelf: 'end' } },
});
globalStyle(`${books} b`, { color: vars.color.text, fontWeight: 500 });

export const key = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp5}`,
  margin: `${space.sp4} 0 0`,
  padding: `${space.sp4} 0 0`,
  borderTop: `1px solid ${vars.color.border}`,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1,
  listStyle: 'none',
});

globalStyle(`${key} li`, {
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
});

const swatch = { width: 12, height: 12, borderRadius: 2 };

export const keySet = style({ ...swatch, background: vars.color.olive });
export const keyAuthor = style({
  ...swatch,
  background: vars.color.markerAuthor,
});
export const keyBoth = style({ ...swatch, background: hatch });
