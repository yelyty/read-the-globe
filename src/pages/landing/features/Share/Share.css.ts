import { globalStyle, style } from '@vanilla-extract/css';

import {
  band,
  compact,
  easeOut,
  forcedColors,
  hover,
  motionOk,
  wrap,
} from '../../../../styles/global.css';
import { fontSize, space, vars } from '../../../../styles/theme.css';
import { sectionTitle } from '../../LandingPage.css';

export const share = style([
  wrap,
  {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, .85fr) minmax(0, 1.15fr)',
    gap: space.sp8,
    alignItems: 'center',
    paddingTop: 112,
    '@media': {
      [compact]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: space.sp7 },
    },
  },
]);

export const title = style(sectionTitle);
export const sub = style({
  maxWidth: '28em',
  marginTop: space.sp4,
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});

export const variants = style({
  display: 'grid',
  gap: space.sp2,
  maxWidth: '28em',
  marginTop: space.sp5,
});

export const variant = style({
  position: 'relative',
  display: 'block',
  marginLeft: `calc(${space.sp2} * -1)`,
  padding: `${space.sp2} ${space.sp2} ${space.sp2} ${space.sp7}`,
  borderRadius: vars.radius.sm,
  color: vars.color.textSecondary,
  fontSize: fontSize.item,
  lineHeight: 1.4,
  cursor: 'pointer',
  '@media': { [hover]: { selectors: { '&:hover': { background: band } } } },
});

globalStyle(`${variant} b`, {
  display: 'block',
  color: vars.color.text,
  fontWeight: 500,
});

globalStyle(`${variant} input`, {
  position: 'absolute',
  top: 12,
  left: 8,
  width: 18,
  height: 18,
  margin: 0,
  border: `1.5px solid ${vars.color.olive}`,
  borderRadius: '50%',
  background: vars.color.background,
  cursor: 'pointer',
  appearance: 'none',
  '@media': { [forcedColors]: { appearance: 'auto' } },
});

globalStyle(`${variant} input:checked`, {
  background: `radial-gradient(circle, ${vars.color.olive} 0 4.5px, ${vars.color.background} 5px)`,
});

export const cta = style({ marginTop: space.sp6 });

// the white card sits on the grey sheet the product window uses
export const stack = style({
  display: 'grid',
  alignItems: 'center',
  padding: space.sp7,
  borderRadius: 24,
  background: band,
  '@media': { [compact]: { padding: space.sp5 } },
});

// the cards crossfade through a 2px blur
export const card = style({
  display: 'block',
  visibility: 'hidden',
  gridArea: '1 / 1',
  width: '100%',
  height: 'auto',
  borderRadius: vars.radius.sm,
  outline: '1px solid rgba(0, 0, 0, .08)',
  outlineOffset: -1,
  opacity: 0,
  filter: 'blur(2px)',
  '@media': {
    [motionOk]: {
      transition: `opacity .2s ${easeOut}, filter .2s ${easeOut}, visibility .2s`,
    },
  },
});
export const on = style({ visibility: 'visible', opacity: 1, filter: 'none' });

export const caption = style({
  gridArea: '2 / 1',
  marginTop: space.sp5,
  color: vars.color.textSecondary,
  fontSize: fontSize.action,
  textWrap: 'pretty',
});
