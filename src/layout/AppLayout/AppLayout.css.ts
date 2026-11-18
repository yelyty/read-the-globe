import { globalStyle, style } from '@vanilla-extract/css';

import { space, vars } from '../../styles/theme.css';
import {
  easeOut,
  easeSoft,
  gutter,
  phone,
  reducedMotion,
} from '../../styles/global.css';
import { start } from '../../pages/landing/features/Header/Header.css';

export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
});

// the app's page: a centred column, the screen's gutter on either side
export const main = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 auto',
  width: '100%',
  maxWidth: 1240,
  marginInline: 'auto',
  paddingInline: gutter,
  paddingBlock: `${space.sp6} ${space.sp8}`,
  background: vars.color.background,
});

// headings in the app use the display face; :where keeps this as weak as a bare h1, so a component's class wins
globalStyle(`:where(${shell}) :is(h1, h2, h3)`, {
  fontFamily: vars.font.display,
  color: vars.color.text,
});

export const pill = style([
  start,
  {
    display: 'none',
    position: 'fixed',
    right: 16,
    bottom: 'max(16px, env(safe-area-inset-bottom))',
    zIndex: 70,
    minHeight: 48,
    textDecoration: 'none',
    transition: `translate .24s ${easeSoft}, scale .2s ${easeOut}, background-color .2s ${easeOut}`,
    selectors: {
      '&[data-away]:not(:focus-visible)': { translate: '0 calc(100% + 32px)' },
    },
    '@media': {
      [phone]: { display: 'inline-flex' },
      [reducedMotion]: { transition: 'none' },
    },
  },
]);
