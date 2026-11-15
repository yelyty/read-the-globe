import { style } from '@vanilla-extract/css';

import { fontSize, vars } from '../../styles/theme.css';

// one centred column under a sticker
export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 560,
  marginInline: 'auto',
  padding: '32px 0 40px',
  textAlign: 'center',
});

export const title = style({
  margin: '0 0 8px',
  fontFamily: vars.font.display,
  fontSize: 22,
  fontWeight: 500,
  color: vars.color.text,
});

export const text = style({
  margin: '0 auto',
  maxWidth: '56ch',
  color: vars.color.textSecondary,
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  marginTop: 32,
});

// a small print line under the actions
export const note = style({
  maxWidth: '48ch',
  margin: '24px auto 0',
  fontSize: fontSize.meta,
  lineHeight: 1.6,
  color: vars.color.textMuted,
});
