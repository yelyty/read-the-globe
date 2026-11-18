import { globalStyle, style, keyframes } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  buttonSize,
  coarse,
  hover,
  reducedMotion,
} from '../../../../styles/global.css';
import { phone, wrap } from '../../LandingPage.css';

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 60,
  background: vars.color.background,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '@media': {
    '(prefers-reduced-transparency: reduce)': {
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
    alignItems: 'center',
    gap: `${space.sp3} ${space.sp5}`,
    paddingBlock: space.sp4,
    '@media': { [phone]: { gap: space.sp2, flexWrap: 'nowrap' } },
  },
]);

export const logoLink = style({
  display: 'flex',
  flex: 'none',
  alignItems: 'center',
  gap: space.sp2,
  marginRight: 'auto',
  textDecoration: 'none',
  color: vars.color.text,
});

export const logo = style({
  display: 'block',
  flex: 'none',
  width: 40,
  height: 40,
});

export const logoTitle = style({
  fontFamily: vars.font.display,
  color: vars.color.text,
  fontSize: fontSize.heading,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  '@media': {
    [phone]: { display: 'none' },
  },
});

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.sp5,
  '@media': {
    'screen and (max-width: 759px)': { display: 'none' },
  },
});

const navText = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  padding: `${space.sp2} ${space.sp1}`,
  margin: `calc(${space.sp2} * -1) calc(${space.sp1} * -1)`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  background: 'none',
  border: 0,
  borderRadius: 6,
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
  alignItems: 'center',
  gap: space.sp2,
  fontFamily: vars.font.sans,
  fontWeight: 500,
  fontSize: fontSize.body,
  color: vars.color.onAccent,
  background: vars.color.primary,
  borderRadius: 999,
  padding: `${space.sp3} ${space.sp5}`,
  minHeight: 40,
  textDecoration: 'none',
  border: 0,
  cursor: 'pointer',
  transition: 'transform .14s, background .14s',
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
const narrow = 'screen and (max-width: 1099px)';
const tiny = 'screen and (max-width: 479px)';
const easeOut = 'cubic-bezier(.23, 1, .32, 1)';
const fill = `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`;
const fillHover = `color-mix(in srgb, ${vars.color.text} 10%, ${vars.color.background})`;

export const topRow = style([
  wrap,
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: space.sp5,
    minHeight: 72,
    '@media': { [narrow]: { gap: space.sp2 } },
  },
]);

export const brand = style({
  display: 'flex',
  flex: 'none',
  alignItems: 'center',
  gap: space.sp2,
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
  '@media': { [tiny]: { display: 'none' } },
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
  borderRadius: 999,
  background: fill,
  '@media': { [narrow]: { display: 'none' } },
});

export const trackLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  padding: `0 ${space.sp4}`,
  borderRadius: 999,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  lineHeight: 1,
  color: vars.color.textSecondary,
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
  alignItems: 'center',
  gap: space.sp2,
  '@media': { [narrow]: { marginLeft: 'auto' } },
});

export const login = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 40,
  padding: 0,
  background: 'none',
  border: 0,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  lineHeight: 1,
  color: vars.color.text,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  '@media': { [narrow]: { display: 'none' } },
});

export const start = style([
  buttonSize,
  {
    display: 'inline-flex',
    alignItems: 'center',
    border: 0,
    borderRadius: 999,
    background: vars.color.primary,
    color: vars.color.onAccent,
    fontFamily: vars.font.sans,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: `scale .2s ${easeOut}, background-color .2s ${easeOut}`,
    ':active': { scale: '.97' },
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
  placeItems: 'center',
  flex: 'none',
  width: 40,
  height: 40,
  padding: 0,
  border: 0,
  borderRadius: 999,
  background: fill,
  color: vars.color.text,
  cursor: 'pointer',
  '@media': {
    [narrow]: { display: 'grid' },
    [coarse]: { width: 44, height: 44 },
  },
});
globalStyle(`${menuBtn} svg`, { width: 18, height: 18 });

const menuIn = keyframes({ from: { opacity: 0, transform: 'scale(.97)' } });

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
  borderRadius: 16,
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
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: 44,
  padding: `0 ${space.sp4}`,
  border: 0,
  borderRadius: 12,
  background: 'none',
  font: 'inherit',
  color: vars.color.text,
  textAlign: 'left',
  textDecoration: 'none',
  cursor: 'pointer',
  ':focus-visible': {
    background: vars.color.primary,
    color: vars.color.onAccent,
    outline: 'none',
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
  borderRadius: '0 0 12px 12px',
});
