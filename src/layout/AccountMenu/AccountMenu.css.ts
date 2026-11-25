import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  hover,
  narrowNav,
  pressed,
  reducedMotion,
} from '../../styles/global.css';
import { navLink } from '../AppHeader/AppHeader.css';

export const menu = style({
  position: 'relative',
  '@media': { [narrowNav]: { flex: '1 1 auto' } },
});

export const button = style([
  navLink,
  {
    gap: space.sp1,
    selectors: {
      '&[aria-expanded="true"]': { color: vars.color.text },
      '&[data-current]': {
        background: vars.color.background,
        color: vars.color.text,
      },
    },
    '@media': { [narrowNav]: { justifyContent: 'center', width: '100%' } },
  },
]);

export const caret = style({
  width: 12,
  height: 12,
  transition: 'rotate .2s cubic-bezier(.23, 1, .32, 1)',
  selectors: { [`${button}[aria-expanded="true"] &`]: { rotate: '180deg' } },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

const listIn = keyframes({ from: { opacity: 0, ...pressed } });

export const list = style({
  position: 'absolute',
  top: 'calc(100% + 10px)',
  right: -12,
  zIndex: 80,
  minWidth: 176,
  padding: space.sp1,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  background: vars.color.surface,
  listStyle: 'none',
  transformOrigin: 'top right',
  animation: `${listIn} .15s cubic-bezier(.23, 1, .32, 1)`,
  selectors: { '&[hidden]': { display: 'none' } },
  '@media': { [reducedMotion]: { animation: 'none' } },
});

globalStyle(`${list} li + li`, {
  marginTop: space.sp1,
  paddingTop: space.sp1,
  borderTop: `1px solid ${vars.color.border}`,
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: 40,
  padding: `0 ${space.sp3}`,
  border: 0,
  borderRadius: vars.radius.sm,
  background: 'none',
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  textAlign: 'left',
  textDecoration: 'none',
  cursor: 'pointer',
  ':focus-visible': {
    outline: 'none',
    background: vars.color.primary,
    color: vars.color.onAccent,
  },
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          background: vars.color.primary,
          color: vars.color.onAccent,
        },
      },
    },
  },
});
