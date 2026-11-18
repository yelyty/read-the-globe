import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';

// a row in the account menu: the label, then the picker; its label lines up with the menu items' text (12px in)
export const menuRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space.sp2,
  minHeight: 40,
  padding: `0 ${space.sp1} 0 ${space.sp3}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.textSecondary,
});
