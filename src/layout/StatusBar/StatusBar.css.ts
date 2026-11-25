import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  coarse,
  easeOut,
  focusRing,
  hover,
  icon,
  phone,
  pressed,
  reducedMotion,
} from '../../styles/global.css';

const barIn = keyframes({ from: { opacity: 0, ...pressed } });

export const bar = style({
  position: 'fixed',
  bottom: 'max(24px, env(safe-area-inset-bottom))',
  left: '50%',
  zIndex: 60,
  display: 'flex',
  gap: space.sp4,
  alignItems: 'center',
  width: 'max-content',
  maxWidth: 'min(520px, calc(100vw - 32px))',
  padding: `${space.sp2} ${space.sp4}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  fontSize: fontSize.body,
  fontWeight: 500,
  transformOrigin: 'bottom center',
  translate: '-50% 0',
  animation: `${barIn} .2s ${easeOut}`,
  '@media': {
    // clear of the floating Log a book pill
    [phone]: { bottom: 'calc(max(16px, env(safe-area-inset-bottom)) + 64px)' },
    [reducedMotion]: { animation: 'none' },
  },
});

export const action = style({
  display: 'inline-flex',
  flex: 'none',
  gap: space.sp2,
  alignItems: 'center',
  margin: `calc(${space.sp2} * -1) 0 calc(${space.sp2} * -1) auto`,
  padding: `${space.sp2} 0`,
  border: 0,
  borderRadius: vars.radius.sm,
  background: 'none',
  color: vars.color.oliveInk,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  textUnderlineOffset: 3,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  '@media': {
    [hover]: { selectors: { '&:hover': { textDecoration: 'underline' } } },
    [coarse]: { minHeight: 44, marginBlock: 0 },
  },
});
globalStyle(`${action} svg`, icon);
