import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import {
  fill,
  fillHover,
  focusRing,
  hover,
  phone,
  reducedMotion,
  tiny,
} from '../../styles/global.css';
import { wrap } from '../../pages/landing/LandingPage.css';

/* One row (brand, the five-tab nav centred, theme and Log a book) needs about 1120px in Ukrainian, the longest.
   Narrower, the header takes two rows: brand and the buttons first, then the nav across the full width. */
const wide = 'screen and (min-width: 1120px)';

export const twoRows = 'screen and (max-width: 1119px)';

export const row = style([
  wrap,
  {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0 24px',
    minHeight: 72,
    '@media': {
      [twoRows]: { minHeight: 0, gap: '12px 24px', paddingTop: 16 },
      [phone]: { gap: 8 },
    },
  },
]);

export const nav = style({
  display: 'flex',
  gap: 4,
  marginLeft: 'auto',
  padding: 4,
  borderRadius: 999,
  background: fill,
  '@media': {
    [wide]: {
      position: 'absolute',
      left: '50%',
      translate: '-50% 0',
      marginLeft: 0,
    },
    [twoRows]: { order: 10, flexBasis: '100%', margin: '0 0 8px' },
    [phone]: { gap: 2 },
    [tiny]: { gap: 0 },
  },
});

export const navLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: '0 16px',
  border: 0,
  borderRadius: 999,
  background: 'none',
  fontFamily: vars.font.sans,
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1,
  color: vars.color.textSecondary,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'background-color .15s ease-out, color .15s ease-out',
  selectors: {
    '&[aria-current="page"]': {
      background: vars.color.background,
      color: vars.color.text,
    },
  },
  ':focus-visible': focusRing,
  '@media': {
    [hover]: {
      selectors: {
        '&:not([aria-current="page"]):hover': {
          background: fillHover,
          color: vars.color.text,
        },
      },
    },
    [reducedMotion]: { transition: 'none' },
    // two rows: the tabs share the nav's full width
    [twoRows]: { flex: '1 1 auto' },
    [phone]: {
      minHeight: 44,
      padding: '0 8px',
      fontSize: 15,
    },
    [tiny]: { padding: '0 6px', fontSize: 14 },
  },
});

export const tools = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginLeft: 'auto',
});
globalStyle(`${tools} > a`, { textDecoration: 'none' });

export const logBtn = style({ '@media': { [phone]: { display: 'none' } } });
