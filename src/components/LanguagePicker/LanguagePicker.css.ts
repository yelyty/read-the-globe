import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

// a row in the account menu: the label, then the picker; its label lines up with the menu items' text (12px in)
export const menuRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minHeight: 40,
  padding: '0 4px 0 12px',
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.textSecondary,
});
