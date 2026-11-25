import { globalStyle, style, keyframes } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  bareButton,
  buttonSize,
  coarse,
  easeOut,
  fill,
  fillHover,
  hover,
  phone,
  pressed,
  reducedMotion,
  reducedTransparency,
  small,
  wrap,
} from '../../../../styles/global.css';

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 60,
  background: vars.color.background,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '@media': {
    [reducedTransparency]: {
      background: vars.color.background,
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    },
  },
});

export const headerRow = style([
  wrap,
  {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${space.sp3} ${space.sp5}`,
    alignItems: 'center',
    paddingBlock: space.sp4,
    '@media': { [phone]: { flexWrap: 'nowrap', gap: space.sp2 } },
  },
]);

export const logoLink = style({
  display: 'flex',
  flex: 'none',
  gap: space.sp2,
  alignItems: 'center',
  marginRight: 'auto',
  color: vars.color.text,
  textDecoration: 'none',
});

export const logo = style({
  display: 'block',
  flex: 'none',
  width: 40,
  height: 40,
});

export const logoTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  '@media': {
    [phone]: { display: 'none' },
  },
});

export const nav = style({
  display: 'flex',
  gap: space.sp5,
  alignItems: 'center',
  '@media': {
    'screen and (max-width: 759px)': { display: 'none' },
  },
});

const navText = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  margin: `calc(${space.sp2} * -1) calc(${space.sp1} * -1)`,
  padding: `${space.sp2} ${space.sp1}`,
  border: 0,
  borderRadius: 6,
  background: 'none',
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
} as const;

export const navLink = style({
  ...navText,
  color: vars.color.textSecondary,
  ':hover': { color: vars.color.textSecondary },
  selectors: {
    '&[aria-current="page"]': { color: vars.color.text },
  },
});

export const loginBtn = style({
  ...navText,
  color: vars.color.text,
  '@media': {
    [phone]: { fontSize: fontSize.body },
  },
});

export const pill = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  minHeight: 40,
  padding: `${space.sp3} ${space.sp5}`,
  border: 0,
  borderRadius: vars.radius.pill,
  background: vars.color.primary,
  color: vars.color.onAccent,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'transform .14s, background .14s',
  cursor: 'pointer',
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
    },
    [phone]: { padding: `${space.sp3} ${space.sp4}`, fontSize: fontSize.body },
  },
});
globalStyle(`${pill} svg`, { width: 14, height: 14 });

export const appHeader = style({});
globalStyle(`${appHeader} :is(a, button)`, { fontFamily: vars.font.display });

/* ---------- the landing's own header, as in the latest mock (e2e-mock/index.html, .top) ---------- */
/* The full row (brand with its Beta chip, four section links, theme, Log in, Start your atlas) needs about 976px
   in Ukrainian, plus the page's side padding. Narrower than this, the sections and Log in fold into the menu. */
export const wideHeader = 'screen and (min-width: 1100px)';
const narrowHeader = 'screen and (max-width: 1099px)';

export const topRow = style([
  wrap,
  {
    position: 'relative',
    display: 'flex',
    gap: space.sp5,
    alignItems: 'center',
    minHeight: 72,
    '@media': { [narrowHeader]: { gap: space.sp2 } },
  },
]);

export const brand = style({
  display: 'flex',
  flex: 'none',
  gap: space.sp2,
  alignItems: 'center',
  color: vars.color.text,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});

// the globe mark alone carries the brand on a phone
export const brandWord = style({
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1,
  '@media': { [small]: { display: 'none' } },
});

// the Beta chip needs the room beside the wordmark and buttons (about 555px); on a phone the logo goes alone
export const brandChip = style({
  '@media': { [phone]: { display: 'none' } },
});

// the sections sit in a track; the one on screen would be a page-white pill inside it
export const track = style({
  display: 'flex',
  gap: space.sp1,
  marginInline: 'auto',
  padding: space.sp1,
  borderRadius: vars.radius.pill,
  background: fill,
  '@media': { [narrowHeader]: { display: 'none' } },
});

export const trackLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  padding: `0 ${space.sp4}`,
  borderRadius: vars.radius.pill,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  lineHeight: 1,
  textDecoration: 'none',
  // a section's name stays on one line ("How it works"), never stacked in the pill
  whiteSpace: 'nowrap',
  transition: 'background-color .15s ease-out, color .15s ease-out',
  selectors: {
    '&[aria-current="true"]': {
      background: vars.color.background,
      color: vars.color.text,
    },
  },
  '@media': {
    [hover]: {
      selectors: {
        '&:not([aria-current="true"]):hover': {
          background: fillHover,
          color: vars.color.text,
        },
      },
    },
    [reducedMotion]: { transition: 'none' },
  },
});

export const tools = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  '@media': { [narrowHeader]: { marginLeft: 'auto' } },
});

export const login = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  border: 0,
  background: 'none',
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  '@media': { [narrowHeader]: { display: 'none' } },
});

export const start = style([
  buttonSize,
  {
    display: 'inline-flex',
    alignItems: 'center',
    border: 0,
    borderRadius: vars.radius.pill,
    background: vars.color.primary,
    color: vars.color.onAccent,
    fontFamily: vars.font.sans,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transition: `scale .2s ${easeOut}, background-color .2s ${easeOut}`,
    cursor: 'pointer',
    ':active': pressed,
    '@media': {
      [hover]: {
        selectors: { '&:hover': { background: vars.color.primaryHover } },
      },
      [coarse]: { minHeight: 44 },
    },
  },
]);

// phones: the sections and Log in fold behind one button
export const menuBtn = style({
  display: 'none',
  flex: 'none',
  placeItems: 'center',
  width: 40,
  height: 40,
  border: 0,
  borderRadius: vars.radius.pill,
  background: fill,
  color: vars.color.text,
  cursor: 'pointer',
  '@media': {
    [narrowHeader]: { display: 'grid' },
    [coarse]: { width: 44, height: 44 },
  },
});
globalStyle(`${menuBtn} svg`, { width: 18, height: 18 });

const menuIn = keyframes({ from: { opacity: 0, ...pressed } });

export const menu = style({
  position: 'absolute',
  top: 'calc(100% - 4px)',
  right: 16,
  zIndex: 30,
  display: 'grid',
  gap: 2,
  width: 'min(280px, 100% - 32px)',
  padding: space.sp1,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  background: vars.color.surface,
  fontFamily: vars.font.sans,
  fontSize: fontSize.item,
  fontWeight: 500,
  lineHeight: 1.2,
  transformOrigin: 'top right',
  animation: `${menuIn} .15s ${easeOut}`,
  selectors: { '&[hidden]': { display: 'none' } },
  '@media': {
    [wideHeader]: { display: 'none' },
    [reducedMotion]: { animation: 'none' },
  },
});

export const menuItem = style({
  ...bareButton,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: 44,
  padding: `0 ${space.sp4}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  textAlign: 'left',
  textDecoration: 'none',
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

export const menuLogin = style({
  marginTop: space.sp1,
  borderTop: `1px solid ${vars.color.border}`,
  borderRadius: `0 0 ${vars.radius.md} ${vars.radius.md}`,
});
