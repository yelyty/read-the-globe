import { style } from '@vanilla-extract/css';

import {
  band,
  easeOut,
  hover,
  narrow,
  reducedMotion,
} from '../../../../styles/global.css';
import { space, vars } from '../../../../styles/theme.css';
import { sectionTitle } from '../../LandingPage.css';

export const faq = style({ marginTop: 112, background: band });

export const inner = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, .8fr) minmax(0, 1.2fr)',
  gap: space.sp7,
  alignItems: 'start',
  width: 'min(1180px, 100% - 32px)',
  marginInline: 'auto',
  padding: `${space.sp9} 0`,
  '@media': {
    [narrow]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: space.sp6,
      padding: `${space.sp8} 0`,
    },
  },
});

export const title = style(sectionTitle);
export const list = style({ display: 'grid', gap: space.sp2 });
export const item = style({
  borderRadius: vars.radius.lg,
  background: vars.color.background,
});

export const summary = style({
  display: 'flex',
  gap: space.sp4,
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: 56,
  padding: `${space.sp4} ${space.sp5}`,
  borderRadius: vars.radius.lg,
  fontWeight: 500,
  lineHeight: 1.35,
  listStyle: 'none',
  cursor: 'pointer',
  selectors: { '&::-webkit-details-marker': { display: 'none' } },
  '@media': {
    [hover]: { selectors: { '&:hover': { color: vars.color.olive } } },
  },
});

export const plus = style({
  flex: 'none',
  width: 16,
  height: 16,
  color: vars.color.olive,
  transition: `rotate .2s ${easeOut}`,
  selectors: { [`${item}[open] &`]: { rotate: '45deg' } },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

export const answer = style({
  maxWidth: '62ch',
  padding: `0 ${space.sp5} ${space.sp5}`,
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});
