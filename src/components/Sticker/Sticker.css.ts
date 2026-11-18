import { style } from '@vanilla-extract/css';

import { space, vars } from '../../styles/theme.css';
import { goldBand } from '../../styles/global.css';

const deepRust = `color-mix(in srgb, ${vars.color.markerAuthor} 80%, black)`;

export const sticker = style({
  width: 120,
  height: 100,
  marginBottom: space.sp5,
});

/* ---------- a shelf with a gap: no books yet ---------- */
export const shelfPlank = style({
  stroke: vars.color.textMuted,
  strokeWidth: 2.6,
});
const book = { strokeWidth: 2 } as const;

export const shelfBookA = style({
  ...book,
  fill: vars.color.primary,
  stroke: vars.color.oliveInk,
});
export const shelfBookB = style({
  ...book,
  fill: vars.color.backgroundDeep,
  stroke: vars.color.mark,
});
export const shelfBookC = style({
  ...book,
  fill: vars.color.markerAuthor,
  stroke: deepRust,
});
// a light band on the dark book, a deep one on the pale book, as on the landing's stack
export const shelfBandA = style({
  stroke: vars.color.onAccent,
  strokeWidth: 1.6,
});
export const shelfBandB = style({ stroke: vars.color.mark, strokeWidth: 1.6 });
// a space kept for the next book
export const shelfGap = style({
  stroke: vars.color.textMuted,
  strokeWidth: 1.6,
  strokeDasharray: '3 3.5',
});

/* ---------- a book with a ribbon: nothing saved to read next ---------- */
export const ribbonBook = style({
  fill: vars.color.backgroundDeep,
  stroke: vars.color.mark,
  strokeWidth: 2.2,
});
export const ribbonSpine = style({
  stroke: vars.color.mark,
  strokeWidth: 1.6,
});
export const ribbonRibbon = style({
  fill: vars.color.markerAuthor,
  stroke: deepRust,
  strokeWidth: 1.6,
});
// the dashed road both the ribbon's and the hilltop's drawings follow
export const road = style({
  stroke: vars.color.textMuted,
  strokeWidth: 1.8,
  strokeDasharray: '3.5 4',
});
// the pin still to be placed
export const ribbonPin = style({
  stroke: vars.color.textMuted,
  strokeWidth: 1.8,
  strokeDasharray: '3 3.5',
});
export const ribbonPinEye = style({
  stroke: vars.color.textMuted,
  strokeWidth: 1.6,
});

/* ---------- a pennant on a hilltop: no goals yet ---------- */
export const hillHill = style({
  fill: goldBand,
  stroke: vars.color.mark,
  strokeWidth: 2.2,
});
export const hillStart = style({ fill: vars.color.olive });
export const hillPole = style({
  stroke: vars.color.textMuted,
  strokeWidth: 2.6,
});
export const hillCloth = style({
  fill: vars.color.primary,
  stroke: vars.color.oliveInk,
  strokeWidth: 2,
});
