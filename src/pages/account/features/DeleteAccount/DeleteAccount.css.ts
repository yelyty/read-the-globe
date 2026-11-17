import { globalStyle, style } from '@vanilla-extract/css';

import { space, vars } from '../../../../styles/theme.css';

export const keepCopy = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${space.sp2} ${space.sp3}`,
  margin: `0 0 ${space.sp4}`,
  padding: `${space.sp3} ${space.sp4}`,
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
});

globalStyle(`${keepCopy} > p:first-child`, {
  flexBasis: '100%',
  margin: 0,
  color: vars.color.text,
});
