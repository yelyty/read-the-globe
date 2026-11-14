import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../../../styles/theme.css';
import { band } from '../../../../styles/global.css';
import { phone } from '../../../landing/LandingPage.css';

export const keepCopy = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 12px',
  margin: '0 0 16px',
  padding: '12px 16px',
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
});

globalStyle(`${keepCopy} > p:first-child`, {
  flexBasis: '100%',
  margin: 0,
  color: vars.color.text,
});

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

export const status = style({
  margin: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.oliveInk,
});
