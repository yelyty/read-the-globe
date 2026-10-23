import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const hint = style({
  margin: '8px 0 0',
  fontSize: 15,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});
