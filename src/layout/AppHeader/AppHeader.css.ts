import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  fill,
  fillHover,
  focusRing,
  hover,
  narrowNav,
  phone,
  reducedMotion,
  tiny,
  wrap,
} from '../../styles/global.css';

/* One row (brand, the five-tab nav centred, theme and Log a book) needs about 1120px in Ukrainian, the longest.
   Narrower, the header takes two rows: brand and the buttons first, then the nav across the full width. */
const wide = 'screen and (min-width: 1120px)';

export const row = style([
  wrap,
  {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    gap: `0 ${space.sp5}`,
    alignItems: 'center',
    minHeight: 72,
    '@media': {
      [narrowNav]: {
        gap: `${space.sp3} ${space.sp5}`,
        minHeight: 0,
        paddingTop: space.sp4,
      },
      [phone]: { gap: space.sp2 },
    },
  },
]);

export const nav = style({
  display: 'flex',
  gap: space.sp1,
  marginLeft: 'auto',
  padding: space.sp1,
  borderRadius: vars.radius.pill,
  background: fill,
  '@media': {
    [wide]: {
      position: 'absolute',
      left: '50%',
      marginLeft: 0,
      translate: '-50% 0',
    },
    [narrowNav]: { flexBasis: '100%', order: 10, margin: `0 0 ${space.sp2}` },
    [phone]: { gap: 2 },
    [tiny]: { gap: 0 },
  },
});

export const navLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: `0 ${space.sp4}`,
  border: 0,
  borderRadius: vars.radius.pill,
  background: 'none',
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  lineHeight: 1,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'background-color .15s ease-out, color .15s ease-out',
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: {
    '&[aria-current="page"]': {
      background: vars.color.background,
      color: vars.color.text,
    },
  },
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
    [narrowNav]: { flex: '1 1 auto' },
    [phone]: {
      minHeight: 44,
      padding: `0 ${space.sp2}`,
      fontSize: fontSize.body,
    },
    [tiny]: { padding: `0 ${space.sp2}`, fontSize: fontSize.body },
  },
});

export const tools = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  marginLeft: 'auto',
});
globalStyle(`${tools} > a`, { textDecoration: 'none' });

export const logBtn = style({ '@media': { [phone]: { display: 'none' } } });
