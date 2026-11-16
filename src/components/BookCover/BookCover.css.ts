import { style, styleVariants } from '@vanilla-extract/css';

import { forcedColors } from '../../styles/global.css';

/* A cloth-bound cover, like an old library book, drawn flat: no shadow or shading, only the book's cloth colour,
   a spine, a plain paper label and gilt bands near the foot. Every cloth is at least 3:1 against both the day and
   night page, so the flat shape holds on either. Each book's binding varies a little (data-label, data-bands,
   data-spine: see coverBinding). The label and gilt are the same in day and night: they're the book's, not
   the page's. */
const PAPER = '#F3EAD3';
const GILT = 'rgba(243, 234, 211, .55)';

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
  // a row on the Shelf and Home: label, bands and spine
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
        // the gilt bands: a box with its top and bottom borders drawn, or just the bottom one
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 9,
          right: 6,
          bottom: 6,
          height: 5,
          borderBlock: `1.5px solid ${GILT}`,
        },
        '&[data-bands="1"]::after': { height: 0, borderTop: 0 },
        '&[data-bands="0"]::after': { display: 'none' },
      },
    },
  ],
  // the map's country cards and the worlds list: too small for detail, so cloth, spine and a plain label
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

const labelBase = style({
  position: 'absolute',
  background: PAPER,
});

export const label = styleVariants({
  row: [
    labelBase,
    {
      left: 10,
      right: 6,
      top: 11,
      height: 20,
      borderRadius: 2,
      selectors: {
        // centred on the cover, above the bands
        '[data-label="middle"] > &': { top: 19 },
        // clear of a leather spine
        '[data-spine] > &': { left: 11 },
      },
    },
  ],
  small: [labelBase, { left: 6, right: 4, top: 7, height: 9, borderRadius: 1 }],
});
