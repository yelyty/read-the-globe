import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import { band, reducedMotion } from '../../styles/global.css';

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
  },
};

export const phone = 'screen and (max-width: 639px)';
export const page = style({
  minHeight: '100vh',
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.serif,
  fontSize: 18,
  lineHeight: 1.55,
  overflowX: 'clip',
  caretColor: vars.color.primary,
  fontVariantNumeric: 'tabular-nums',
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
});
// ponytail: follows data-theme only, which index.html's head script always sets
globalStyle(`:root[data-theme="dark"] ${page}`, { vars: illustration.dark });

/* :where() keeps these at one class of specificity, so component classes win. */
globalStyle(`${page} :where(h1, h2, h3)`, {
  margin: 0,
  fontFamily: vars.font.display,
  fontWeight: 500,
});

globalStyle(`${page} :where(p)`, { margin: 0 });

globalStyle(`${page} :where(a)`, {
  color: vars.color.text,
  textUnderlineOffset: 3,
  textUnderlinePosition: 'from-font',
  textDecorationSkipInk: 'auto',
});

globalStyle(`${page} :where(button, input, textarea)`, {
  font: 'inherit',
  color: 'inherit',
});

globalStyle(`${page} ::selection`, { background: 'rgba(74, 106, 64, 0.25)' });

globalStyle('body:has(dialog[open])', { overflow: 'hidden' });

// section links land below the sticky header
globalStyle(`html:has(${page})`, {
  scrollPaddingTop: 80,
  scrollBehavior: 'smooth',
  '@media': { [reducedMotion]: { scrollBehavior: 'auto' } },
});

export const headline = {
  fontFamily: vars.font.sans,
  fontWeight: 800,
  lineHeight: 1.02,
  letterSpacing: '-.03em',
  textWrap: 'balance',
} as const;
export const sectionTitle = {
  ...headline,
  fontSize: 'clamp(34px, 4.6vw, 56px)',
} as const;

export const wrap = style({
  maxWidth: 1240,
  marginInline: 'auto',
  paddingInline: 'clamp(18px, 4vw, 40px)',
});

export const skip = style({
  position: 'absolute',
  left: 16,
  top: -64,
  zIndex: 100,
  padding: '12px 16px',
  borderRadius: 8,
  background: vars.color.primary,
  color: vars.color.onAccent,
  fontFamily: vars.font.sans,
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1,
  textDecoration: 'none',
  ':focus': { top: 16 },
});

export const main = style({ outline: 'none' });
