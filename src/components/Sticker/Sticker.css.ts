import { style } from '@vanilla-extract/css';

import { space, vars } from '../../styles/theme.css';

const deepRust = `color-mix(in srgb, ${vars.color.markerAuthor} 80%, black)`;

export const sticker = style({
  width: 120,
  height: 100,
  marginBottom: space.sp5,
});

/* ---------- a shelf of three books and a plant: no books yet ---------- */
const shelfLine = { strokeWidth: 1 } as const;

export const shelfPlank = style({ fill: vars.color.textSecondary });
export const shelfBookRust = style({
  ...shelfLine,
  fill: vars.color.markerAuthor,
  stroke: deepRust,
});
export const shelfBookOlive = style({
  ...shelfLine,
  fill: vars.color.primary,
  stroke: vars.color.oliveInk,
});
export const shelfBookPale = style({
  ...shelfLine,
  fill: vars.color.stickerGold,
  stroke: vars.color.mark,
});
// the pale bands across each spine
export const shelfBand = style({
  ...shelfLine,
  fill: vars.color.stickerGold,
  stroke: deepRust,
});
export const shelfLeaf = style({
  ...shelfLine,
  fill: vars.color.primary,
  stroke: vars.color.oliveInk,
});
export const shelfPot = style({
  ...shelfLine,
  fill: vars.color.stickerGold,
  stroke: vars.color.textSecondary,
});

/* ---------- a shelf of empty book outlines and a plant: nothing to read next ---------- */
// the books still to be picked, drawn as outlines only
export const nextBookRust = style({ ...shelfLine, stroke: deepRust });
export const nextBookOlive = style({
  ...shelfLine,
  stroke: vars.color.oliveInk,
});
export const nextBookPale = style({
  ...shelfLine,
  stroke: vars.color.secondary,
});
export const nextPot = style({
  ...shelfLine,
  fill: `color-mix(in srgb, ${vars.color.fieldLine} 80%, ${vars.color.background})`,
  stroke: vars.color.textSecondary,
});

/* ---------- a stack of books with a pennant on top: no goals yet ---------- */
// a faded rust for the top book
const softRust = `color-mix(in srgb, ${vars.color.markerAuthor} 88%, ${vars.color.background})`;

export const goalBookSoftRust = style({
  ...shelfLine,
  fill: softRust,
  stroke: deepRust,
});
// the pole and its pennant
export const goalFlag = style({
  ...shelfLine,
  fill: vars.color.primary,
  stroke: vars.color.oliveInk,
});
