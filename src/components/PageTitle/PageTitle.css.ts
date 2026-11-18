import { style } from '@vanilla-extract/css';

import { phone } from '../../styles/global.css';
import { fontSize, space, vars } from '../../styles/theme.css';

export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: `${space.sp2} ${space.sp4}`,
  marginBottom: space.sp5,
});

export const title = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sp4,
  margin: 0,
  fontFamily: vars.font.display,
  fontWeight: 500,
  fontSize: fontSize.title,
  lineHeight: 1.1,
  color: vars.color.text,
  '@media': { [phone]: { fontSize: fontSize.numerals } },
});
