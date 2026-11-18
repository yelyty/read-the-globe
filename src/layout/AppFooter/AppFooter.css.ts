import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { coarse, hover, phone } from '../../styles/global.css';
import { wrap } from '../../pages/landing/LandingPage.css';

const pillFloats = 'screen and (max-width: 899px)';

export const footer = style({
  marginTop: 'auto',
  borderTop: `1px solid ${vars.color.stroke}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.meta,
  color: vars.color.textMuted,
});

export const row = style([
  wrap,
  {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: `${space.sp2} ${space.sp5}`,
    paddingBlock: `${space.sp4} ${space.sp5}`,
    '@media': {
      [pillFloats]: { paddingBottom: space.sp9 },
    },
  },
]);

export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp1} ${space.sp4}`,
});

export const link = style({
  color: vars.color.textSecondary,
  textDecoration: 'none',
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          color: vars.color.text,
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        },
      },
    },
    [coarse]: { display: 'inline-flex', alignItems: 'center', minHeight: 44 },
    [phone]: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 44,
      minWidth: 44,
      justifyContent: 'center',
    },
  },
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: 2,
      borderRadius: 3,
    },
  },
});

export const credit = style({
  marginLeft: 'auto',
  '@media': { [pillFloats]: { marginLeft: 0 } },
});
