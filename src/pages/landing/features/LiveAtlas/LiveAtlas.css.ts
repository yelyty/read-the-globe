import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import { band, easeOut, hatch } from '../../../../styles/global.css';

const narrow = 'screen and (max-width: 799px)';

/* the product, straight under the hero: --z and --tilt come from the scroll (LiveAtlas.tsx) */
export const frame = style({
  width: 'min(1120px, 100% - 32px)',
  margin: '0 auto',
  padding: space.sp2,
  background: band,
  borderRadius: 24, // concentric: the 16px sheet + 8px padding
  scale: 'var(--z, 1)',
  transformOrigin: '50% 0',
  transform: 'perspective(1600px) rotateX(var(--tilt, 0deg))',
});

export const sheet = style({
  padding: `${space.sp5} ${space.sp6}`,
  borderRadius: 16,
  background: vars.color.background,
  '@media': { [narrow]: { padding: space.sp4 } },
});

export const head = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: space.sp4,
});
export const title = style({
  fontFamily: vars.font.serif,
  fontWeight: 500,
  fontSize: 'clamp(24px, 2.6vw, 34px)',
  lineHeight: 1.1,
});
export const tag = style({
  fontFamily: vars.font.sans,
  fontWeight: 500,
  fontSize: fontSize.body,
  lineHeight: 1,
  color: vars.color.textMuted,
});

export const map = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  marginTop: space.sp4,
  overflow: 'visible',
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
  transformBox: 'fill-box',
  transformOrigin: 'center',
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      animation: `${pingOut} .6s ${easeOut}`,
    },
  },
});

export const foot = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  alignItems: 'end',
  gap: `${space.sp2} ${space.sp5}`,
  marginTop: space.sp4,
  '@media': { [narrow]: { gridTemplateColumns: 'auto 1fr' } },
});

export const count = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: space.sp2,
});

globalStyle(`${count} b`, {
  fontFamily: vars.font.serif,
  fontWeight: 400,
  fontSize: 'clamp(40px, 4.4vw, 56px)',
  lineHeight: 1,
  fontVariantNumeric: 'lining-nums tabular-nums',
  minWidth: '2ch',
});

globalStyle(`${count} span`, {
  fontSize: fontSize.heading,
  lineHeight: 1,
  color: vars.color.textSecondary,
});

globalStyle(`${count} em`, {
  fontFamily: vars.font.sans,
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: fontSize.meta,
  lineHeight: 1,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: vars.color.textMuted,
});

export const now = style({
  display: 'flex',
  alignItems: 'end',
  minHeight: '2.7em',
  fontSize: fontSize.action,
  lineHeight: 1.35,
  color: vars.color.textSecondary,
  textWrap: 'balance',
  '@media': { [narrow]: { gridColumn: '1 / -1', gridRow: 2, minHeight: 0 } },
});

export const books = style({
  fontFamily: vars.font.sans,
  fontWeight: 500,
  fontSize: fontSize.body,
  lineHeight: 1,
  color: vars.color.textMuted,
  '@media': { [narrow]: { justifySelf: 'end' } },
});
globalStyle(`${books} b`, { fontWeight: 500, color: vars.color.text });

export const key = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp5}`,
  margin: `${space.sp4} 0 0`,
  padding: `${space.sp4} 0 0`,
  borderTop: `1px solid ${vars.color.border}`,
  listStyle: 'none',
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1,
  color: vars.color.textSecondary,
});

globalStyle(`${key} li`, {
  display: 'flex',
  alignItems: 'center',
  gap: space.sp2,
});

const swatch = { width: 12, height: 12, borderRadius: 2 };

export const keySet = style({ ...swatch, background: vars.color.olive });
export const keyAuthor = style({
  ...swatch,
  background: vars.color.markerAuthor,
});
export const keyBoth = style({ ...swatch, background: hatch });
