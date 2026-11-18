import { globalStyle, style } from '@vanilla-extract/css';

import { band, easeOut, hover } from '../../../../styles/global.css';
import { fontSize, space, vars } from '../../../../styles/theme.css';
import { sectionTitle, wrap } from '../../LandingPage.css';

const narrow = 'screen and (max-width: 899px)';

export const share = style([
  wrap,
  {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, .85fr) minmax(0, 1.15fr)',
    alignItems: 'center',
    gap: space.sp8,
    paddingTop: 112,
    '@media': {
      [narrow]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: space.sp7 },
    },
  },
]);

export const title = style(sectionTitle);
export const sub = style({
  marginTop: space.sp4,
  maxWidth: '28em',
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
  borderRadius: 8,
  fontSize: fontSize.item,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
  cursor: 'pointer',
  '@media': { [hover]: { selectors: { '&:hover': { background: band } } } },
});

globalStyle(`${variant} b`, {
  display: 'block',
  fontWeight: 500,
  color: vars.color.text,
});

globalStyle(`${variant} input`, {
  appearance: 'none',
  position: 'absolute',
  left: 8,
  top: 12,
  width: 18,
  height: 18,
  margin: 0,
  border: `1.5px solid ${vars.color.olive}`,
  borderRadius: '50%',
  background: vars.color.background,
  cursor: 'pointer',
  '@media': { '(forced-colors: active)': { appearance: 'auto' } },
});

globalStyle(`${variant} input:checked`, {
  background: `radial-gradient(circle, ${vars.color.olive} 0 4.5px, ${vars.color.background} 5px)`,
});

export const cta = style({ marginTop: space.sp6 });

// the white card sits on the grey sheet the product window uses
export const stack = style({
  display: 'grid',
  alignItems: 'center',
  margin: 0,
  padding: space.sp7,
  background: band,
  borderRadius: 24,
  '@media': { [narrow]: { padding: space.sp5 } },
});

// the cards crossfade through a 2px blur
export const card = style({
  gridArea: '1 / 1',
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: 8,
  outline: '1px solid rgba(0, 0, 0, .08)',
  outlineOffset: -1,
  opacity: 0,
  visibility: 'hidden',
  filter: 'blur(2px)',
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: `opacity .2s ${easeOut}, filter .2s ${easeOut}, visibility .2s`,
    },
  },
});
export const on = style({ opacity: 1, visibility: 'visible', filter: 'none' });

export const caption = style({
  gridArea: '2 / 1',
  marginTop: space.sp5,
  fontSize: fontSize.action,
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});
