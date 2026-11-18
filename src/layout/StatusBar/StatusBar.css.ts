import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  coarse,
  easeOut,
  focusRing,
  hover,
  phone,
  reducedMotion,
} from '../../styles/global.css';

const barIn = keyframes({ from: { opacity: 0, scale: '.97' } });

export const bar = style({
  position: 'fixed',
  zIndex: 60,
  left: '50%',
  bottom: 'max(24px, env(safe-area-inset-bottom))',
  translate: '-50% 0',
  display: 'flex',
  alignItems: 'center',
  gap: space.sp4,
  width: 'max-content',
  maxWidth: 'min(520px, calc(100vw - 32px))',
  padding: `${space.sp2} ${space.sp4}`,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 8,
  fontSize: fontSize.body,
  fontWeight: 500,
  transformOrigin: 'bottom center',
  animation: `${barIn} .2s ${easeOut}`,
  '@media': {
    // clear of the floating Log a book pill
    [phone]: { bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 64px)' },
    [reducedMotion]: { animation: 'none' },
  },
});

export const action = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sp2,
  flex: 'none',
  margin: `calc(${space.sp2} * -1) 0 calc(${space.sp2} * -1) auto`,
  padding: `${space.sp2} 0`,
  border: 0,
  borderRadius: 8,
  background: 'none',
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.oliveInk,
  cursor: 'pointer',
  textUnderlineOffset: 3,
  ':focus-visible': focusRing,
  '@media': {
    [hover]: { selectors: { '&:hover': { textDecoration: 'underline' } } },
    [coarse]: { minHeight: 44, marginBlock: 0 },
  },
});
globalStyle(`${action} svg`, { width: 16, height: 16, flex: 'none' });
