import { style, globalStyle } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { band, headline, reducedMotion } from '../../styles/global.css';

// the mock's illustration colours (hero stickers, feature panels) that the app's theme has no token for
const illustration = {
  light: {
    '--green': '#3C5734',
    '--on-green': '#F5E6B8',
    '--on-green2': '#DDCCA6',
    '--clay': '#8B3A33',
    '--on-clay': '#F7E4DE',
    '--on-clay2': '#EBC9C1',
    '--ochre': '#C7A536',
    '--on-ochre': '#3A2E14',
    '--land': '#F3D89A',
    '--line': '#E3D6B4',
    '--land-t': '#F6E6BD',
    '--sage': '#E4E8D9',
    '--o-green': '#33502B',
    '--o-rust': '#6E2C26',
    '--o-gold': '#9A7F35',
    '--o-olive': '#4F5828',
    // the hero's desk globe: its ball, its outline and land, its stand
    '--globe': '#D6A77B',
    '--o-globe': '#794F0F',
    '--stand': '#5A4A2E',
    // the hero stickers' die-cut edge and the shadow that lifts them off the page
    '--die-cut': '#FFFFFF',
    '--die-shadow': 'rgba(74, 56, 24, .22)',
  },
  dark: {
    '--green': '#2E4527',
    '--clay': '#6E2C27',
    '--ochre': '#B8962F',
    '--land': '#5C4E35',
    '--line': '#4C4029',
    '--land-t': '#3A3222',
    '--sage': '#2A2E22',
    '--o-green': '#9DBB8C',
    '--o-rust': '#E39A8F',
    '--o-gold': '#E2C66B',
    '--o-olive': '#BAC584',
    '--globe': '#8C6A4A',
    '--o-globe': '#E0B88A',
    '--stand': '#A8955F',
    // a warm paper white, so the edge doesn't glare on the dark page
    '--die-cut': '#F4ECDA',
    '--die-shadow': 'rgba(0, 0, 0, .5)',
  },
};

export const page = style({
  vars: {
    ...illustration.light,
    '--rust': vars.color.markerAuthor,
    '--olive': vars.color.olive,
    '--olive-wash': vars.color.oliveWash,
    '--rust-wash': vars.color.rustWash,
    '--gold': vars.color.secondary,
    '--card': vars.color.surface,
    '--bg2': vars.color.backgroundDeep,
    '--ink': vars.color.text,
    '--ink3': vars.color.textMuted,
    '--band': band,
  },
  minHeight: '100vh',
  overflowX: 'clip',
  background: vars.color.background,
  color: vars.color.text,
  caretColor: vars.color.primary,
  fontFamily: vars.font.serif,
  fontSize: fontSize.item,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.55,
});
globalStyle(`:root[data-theme="dark"] ${page}`, { vars: illustration.dark });

/* :where() keeps these at one class of specificity, so component classes win. */
globalStyle(`${page} :where(h1, h2, h3)`, {
  fontFamily: vars.font.display,
  fontWeight: 500,
});

// no weight at all, like the buttons below: a tie with a link's own class (the footer's, on the green) went to whichever sheet loaded last
globalStyle(`:where(${page}) :where(a)`, {
  color: vars.color.text,
  textDecorationSkipInk: 'auto',
  textUnderlineOffset: 3,
  textUnderlinePosition: 'from-font',
});

// no weight at all (:where on both), so any button's own class, its size included, wins over it
globalStyle(`:where(${page}) :where(button, input, textarea)`, {
  color: 'inherit',
  font: 'inherit',
});

globalStyle(`${page} ::selection`, {
  background: `color-mix(in srgb, ${vars.color.primary} 25%, transparent)`,
});

globalStyle('body:has(dialog[open])', { overflow: 'hidden' });

// section links land below the sticky header
globalStyle(`html:has(${page})`, {
  scrollPaddingTop: 80,
  scrollBehavior: 'smooth',
  '@media': { [reducedMotion]: { scrollBehavior: 'auto' } },
});

export const sectionTitle = {
  ...headline,
  fontSize: 'clamp(34px, 4.6vw, 56px)',
} as const;

export const skip = style({
  position: 'absolute',
  top: -64,
  left: 16,
  zIndex: 100,
  padding: `${space.sp3} ${space.sp4}`,
  borderRadius: vars.radius.sm,
  background: vars.color.primary,
  color: vars.color.onAccent,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  lineHeight: 1,
  textDecoration: 'none',
  ':focus': { top: 16 },
});

export const main = style({ outline: 'none' });
