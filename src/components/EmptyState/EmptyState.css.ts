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
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
});

export const text = style({
  maxWidth: '56ch',
  margin: '0 auto',
  color: vars.color.textSecondary,
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp4,
  alignItems: 'center',
  marginTop: space.sp6,
});

// a small print line under the actions
export const note = style({
  maxWidth: '48ch',
  margin: `${space.sp5} auto 0`,
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
  lineHeight: 1.6,
});
