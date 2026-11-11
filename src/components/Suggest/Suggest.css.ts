import { style } from '@vanilla-extract/css';
import { fontSize, vars } from '../../styles/theme.css';
import { hover } from '../../styles/global.css';

// a floating layer: a thin edge in place of a shadow
export const menu = style({
  position: 'fixed',
  inset: 'auto',
  margin: 0,
  boxSizing: 'border-box',
  overflow: 'auto',
  overscrollBehavior: 'contain',
  padding: 8,
  listStyle: 'none',
  background: vars.color.surface,
  color: vars.color.textSecondary,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 16,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: 40,
  padding: '0 16px',
  borderRadius: 8,
  cursor: 'pointer',
  selectors: {
    '&[aria-selected="true"]': {
      background: vars.color.primary,
      color: vars.color.onAccent,
    },
  },
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          background: vars.color.primary,
          color: vars.color.onAccent,
        },
      },
    },
  },
});
