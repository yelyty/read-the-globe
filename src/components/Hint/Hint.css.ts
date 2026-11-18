import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';

export const hint = style({
  margin: `${space.sp2} 0 0`,
  fontSize: fontSize.body,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});
