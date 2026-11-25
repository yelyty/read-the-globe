import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { band, phone } from '../../styles/global.css';

export const item = style({
  marginTop: space.sp4,
  padding: space.sp5,
  borderRadius: vars.radius.lg,
  background: band,
  selectors: { '&:first-of-type': { marginTop: 0 } },
  '@media': { [phone]: { padding: space.sp4 } },
});

export const dangerItem = style([
  item,
  {
    background: `color-mix(in srgb, ${vars.color.markerAuthor} 8%, ${vars.color.background})`,
  },
]);

export const itemTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.item,
  fontWeight: 500,
  lineHeight: 1.2,
  selectors: { [`${dangerItem} &`]: { color: vars.color.markerAuthor } },
});

export const itemText = style({
  maxWidth: '52ch',
  margin: `${space.sp2} 0 ${space.sp4}`,
  color: vars.color.textSecondary,
});

export const wrapper = style({
  maxWidth: 760,
  marginInline: 'auto',
});

export const form = style({ maxWidth: 520 });

globalStyle(`${form} input[readonly]`, {
  borderColor: vars.color.border,
  boxShadow: 'none',
  background: vars.color.background,
  color: vars.color.textSecondary,
  cursor: 'default',
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp3} ${space.sp4}`,
  alignItems: 'center',
  marginTop: space.sp2,
});

export const example = style({
  margin: `calc(-1 * ${space.sp2}) 0 ${space.sp2}`,
});
