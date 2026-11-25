import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  easeSoft,
  gutter,
  hover,
  phone,
  reducedMotion,
} from '../../styles/global.css';

export const plate = style({ position: 'relative' });

export const scroll = style({
  '@media': {
    [phone]: {
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
      scrollbarWidth: 'thin',
      scrollbarColor: `${vars.color.border} transparent`,
      marginInline: `calc(-1 * ${gutter})`,
      paddingInline: gutter,
      // the edge that hides more of the world fades out, so the map reads as wider than the screen
      selectors: {
        '&[data-more-right]': {
          maskImage: 'linear-gradient(90deg, #000 85%, transparent)',
        },
        '&[data-more-left]': {
          maskImage: 'linear-gradient(90deg, transparent, #000 15%)',
        },
        '&[data-more-left][data-more-right]': {
          maskImage:
            'linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)',
        },
      },
    },
  },
});

// phones only: the one-time "Slide to see the whole map"
export const hint = style({
  display: 'none',
  '@media': {
    [phone]: {
      display: 'flex',
      gap: space.sp2,
      alignItems: 'center',
      justifyContent: 'center',
      margin: `${space.sp2} 0 0`,
      color: vars.color.textSecondary,
      fontSize: fontSize.meta,
    },
  },
});
globalStyle(`${hint} svg`, { width: 16, height: 16 });

export const map = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  '@media': { [phone]: { width: 596, maxWidth: 'none' } },
});

export const land = style({
  outline: 'none',
  fill: vars.color.backgroundDeep,
  fillOpacity: 0.55,
  stroke: vars.color.border,
  strokeWidth: 0.5,
  strokeLinejoin: 'round',
  transition: 'fill-opacity .18s ease, fill .18s ease',
});
export const set = style({});
export const author = style({});
export const marked = style({ cursor: 'pointer' });
// Home: an unmarked country lifts under the pointer, somewhere a book could go
export const open = style({
  cursor: 'pointer',
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          fillOpacity: 0.95,
          stroke: vars.color.textMuted,
          strokeWidth: 0.8,
        },
      },
    },
  },
});

// a pinned country settles in: it inks from nothing under a gold edge
const landIn = keyframes({
  '0%': { fillOpacity: 0, stroke: vars.color.secondary, strokeWidth: 2 },
  '55%': { fillOpacity: 1 },
  '100%': { stroke: vars.color.border },
});

export const landed = style({
  animation: `${landIn} .7s ${easeSoft} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

globalStyle(`${land}${set}`, { fill: vars.color.olive, fillOpacity: 0.92 });

globalStyle(`${land}${author}`, {
  fill: vars.color.markerAuthor,
  fillOpacity: 0.92,
});

globalStyle(`${land}${set}${author}`, {
  fill: vars.color.olive,
  stroke: vars.color.markerAuthor,
  strokeWidth: 1.6,
  vectorEffect: 'non-scaling-stroke',
});

globalStyle(`${land}${marked}:hover`, {
  fillOpacity: 1,
  stroke: vars.color.text,
  strokeWidth: 1,
});

globalStyle(
  `${plate}[data-show="set"] ${land}${author}:not(${set}), ${plate}[data-show="author"] ${land}${set}:not(${author})`,
  {
    fill: vars.color.backgroundDeep,
    fillOpacity: 0.55,
    cursor: 'default',
  }
);

globalStyle(`${plate}[data-show="set"] ${land}${set}${author}`, {
  fill: vars.color.olive,
  stroke: vars.color.border,
  strokeWidth: 0.5,
});

globalStyle(`${plate}[data-show="author"] ${land}${set}${author}`, {
  fill: vars.color.markerAuthor,
  stroke: vars.color.border,
  strokeWidth: 0.5,
});

export const dots = style({ pointerEvents: 'none' });

globalStyle(`${plate}[data-show="author"] ${dots}`, { display: 'none' });

export const dot = style({
  fill: vars.color.surface,
  stroke: vars.color.oliveInk,
  strokeWidth: 1.1,
});

globalStyle(`${land}${set}${author}`, { fill: 'url(#both-hatch)' });

globalStyle(`${plate}[data-show="set"] ${land}${set}${author}`, {
  fill: vars.color.olive,
});

globalStyle(`${plate}[data-show="author"] ${land}${set}${author}`, {
  fill: vars.color.markerAuthor,
});

export { srOnly } from '../../styles/global.css';
