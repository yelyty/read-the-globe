import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import { hover } from '../../styles/global.css';

// a row in the account menu: the label, then the select
export const menuRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minHeight: 40,
  padding: '0 8px 0 16px',
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.textSecondary,
});

export const select = style({
  minHeight: 32,
  padding: '0 8px',
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  background: vars.color.background,
  fontFamily: vars.font.sans,
  fontSize: 15,
  color: vars.color.text,
  cursor: 'pointer',
  ':focus-visible': {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: 2,
  },
});

// the landing footer's tail, on the green: a quiet outlined select, as in the mock
export const footSelect = style({
  height: 40,
  minWidth: 160,
  padding: '0 8px 0 16px',
  border: `1.5px solid ${vars.color.onAccentMuted}`,
  borderRadius: 8,
  background: vars.color.primary,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.onAccent,
  cursor: 'pointer',
  ':focus-visible': {
    outline: `2px solid ${vars.color.secondaryBright}`,
    outlineOffset: 2,
  },
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: vars.color.primaryHover } },
    },
  },
});
