import { globalStyle, style } from '@vanilla-extract/css';

import { space, vars } from '../../../../styles/theme.css';

export const keepCopy = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp3}`,
  alignItems: 'center',
  margin: `0 0 ${space.sp4}`,
  padding: `${space.sp3} ${space.sp4}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.background,
});

globalStyle(`${keepCopy} > p:first-child`, {
  flexBasis: '100%',
  margin: 0,
  color: vars.color.text,
});
