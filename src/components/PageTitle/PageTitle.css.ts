import { style } from '@vanilla-extract/css';

import { phone } from '../../styles/global.css';
import { fontSize, space, vars } from '../../styles/theme.css';

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginBottom: space.sp5,
});

export const title = style({
  display: 'inline-flex',
  gap: space.sp4,
  alignItems: 'center',
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.title,
  fontWeight: 500,
  lineHeight: 1.1,
  '@media': { [phone]: { fontSize: fontSize.numerals } },
});
