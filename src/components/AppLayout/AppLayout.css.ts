import { style } from '@vanilla-extract/css';
import { space } from '../../styles/theme.css';
import {
  easeOut,
  easeSoft,
  phone,
  reducedMotion,
} from '../../styles/global.css';
import { start } from '../../pages/LandingPage/components/Header/Header.css';

export const shell = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
});

export const main = style({
  flex: '1 0 auto',
  width: '100%',
  paddingBlock: `${space.sp6} 56px`,
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
