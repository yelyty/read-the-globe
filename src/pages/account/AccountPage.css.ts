import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { band } from '../../styles/global.css';
import { phone } from '../landing/LandingPage.css';

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
  margin: 0,
  fontFamily: vars.font.display,
  fontSize: fontSize.item,
  fontWeight: 500,
  lineHeight: 1.2,
  color: vars.color.text,
  selectors: { [`${dangerItem} &`]: { color: vars.color.markerAuthor } },
});

export const itemText = style({
  margin: `${space.sp2} 0 ${space.sp4}`,
  maxWidth: '52ch',
  color: vars.color.textSecondary,
});

export const wrapper = style({
  maxWidth: 760,
  marginInline: 'auto',
});

export const form = style({ maxWidth: 520 });

globalStyle(`${form} input[readonly]`, {
  background: vars.color.background,
  borderColor: vars.color.border,
  color: vars.color.textSecondary,
  cursor: 'default',
  boxShadow: 'none',
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${space.sp3} ${space.sp4}`,
  marginTop: space.sp2,
});

export const example = style({
  margin: `calc(-1 * ${space.sp2}) 0 ${space.sp2}`,
});
