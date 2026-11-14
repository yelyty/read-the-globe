import { style } from '@vanilla-extract/css';
import { sectionTitle } from '../../LandingPage.css';
import {
  band,
  easeOut,
  hover,
  reducedMotion,
} from '../../../../styles/global.css';
import { vars } from '../../../../styles/theme.css';

export const faq = style({ marginTop: 112, background: band });

export const inner = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, .8fr) minmax(0, 1.2fr)',
  gap: 48,
  alignItems: 'start',
  width: 'min(1180px, 100% - 32px)',
  marginInline: 'auto',
  padding: '96px 0',
  '@media': {
    'screen and (max-width: 799px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: 32,
      padding: '72px 0',
    },
  },
});

export const title = style(sectionTitle);
export const list = style({ display: 'grid', gap: 8 });
export const item = style({
  background: vars.color.background,
  borderRadius: 16,
});

export const summary = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  minHeight: 56,
  padding: '16px 24px',
  borderRadius: 16,
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
  padding: '0 24px 24px',
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});
