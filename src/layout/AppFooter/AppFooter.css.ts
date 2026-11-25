import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { coarse, compact, hover, phone, wrap } from '../../styles/global.css';

export const footer = style({
  marginTop: 'auto',
  borderTop: `1px solid ${vars.color.stroke}`,
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.meta,
});

export const row = style([
  wrap,
  {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${space.sp2} ${space.sp5}`,
    alignItems: 'baseline',
    paddingBlock: `${space.sp4} ${space.sp5}`,
    '@media': {
      [compact]: { paddingBottom: space.sp9 },
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
  selectors: {
    '&:focus-visible': {
      borderRadius: 3,
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: 2,
    },
  },
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
      justifyContent: 'center',
      minWidth: 44,
      minHeight: 44,
    },
  },
});

export const credit = style({
  marginLeft: 'auto',
  '@media': { [compact]: { marginLeft: 0 } },
});
