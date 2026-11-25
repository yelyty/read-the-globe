import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';

export const hint = style({
  margin: `${space.sp2} 0 0`,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  lineHeight: 1.4,
});
