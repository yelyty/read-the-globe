import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import { band } from '../../styles/global.css';
import { phone } from '../LandingPage/LandingPage.css';

export const item = style({
  marginTop: 16,
  padding: 24,
  borderRadius: 16,
  background: band,
  selectors: { '&:first-of-type': { marginTop: 0 } },
  '@media': { [phone]: { padding: 16 } },
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
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1.2,
  color: vars.color.text,
  selectors: { [`${dangerItem} &`]: { color: vars.color.markerAuthor } },
});

export const itemText = style({
  margin: '8px 0 16px',
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
  gap: '12px 16px',
  marginTop: 8,
});

export const status = style({
  margin: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.oliveInk,
});
