import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';

// one centred column under a sticker
export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 560,
  marginInline: 'auto',
  padding: `${space.sp6} 0 ${space.sp7}`,
  textAlign: 'center',
});

export const title = style({
  margin: `0 0 ${space.sp2}`,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
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
  gap: space.sp4,
  marginTop: space.sp6,
});

// a small print line under the actions
export const note = style({
  maxWidth: '48ch',
  margin: `${space.sp5} auto 0`,
  fontSize: fontSize.meta,
  lineHeight: 1.6,
  color: vars.color.textMuted,
});
