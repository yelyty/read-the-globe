import { style, styleVariants } from '@vanilla-extract/css';

import { forcedColors } from '../../styles/global.css';

/* A cloth-bound cover, like an old library book, drawn flat: no shadow or shading, only the book's cloth colour
   and a spine. Every cloth is at least 3:1 against both the day and night page, so the flat shape holds on either.
   Some books have a darker leather spine (data-spine: see coverBinding). */

const base = style({
  position: 'relative',
  display: 'block',
  flex: 'none',
  overflow: 'hidden',
  // a book's back edge is square, its fore-edge a little rounded
  borderRadius: '2px 4px 4px 2px',
  // the spine: a pale crease, or a darker leather strip (data-spine)
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    background: 'rgba(255, 255, 255, .18)',
  },
  '@media': {
    [forcedColors]: { border: '1px solid' },
  },
});

export const cover = styleVariants({
  // a row on the Shelf and Home: a crease or a leather spine
  row: [
    base,
    {
      width: 44,
      height: 62,
      selectors: {
        '&::before': { left: 4 },
        '&[data-spine]::before': {
          left: 0,
          width: 6,
          background: 'rgba(0, 0, 0, .2)',
        },
      },
    },
  ],
  // the map's country cards and the worlds list: too small for detail, so cloth and a crease
  small: [
    base,
    {
      width: 26,
      height: 37,
      borderRadius: '1px 3px 3px 1px',
      selectors: {
        '&::before': { left: 2.5, width: 1 },
      },
    },
  ],
});
