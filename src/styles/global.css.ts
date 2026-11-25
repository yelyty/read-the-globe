import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from './theme.css';

export const hover = '(hover: hover)';
export const narrowNav = 'screen and (max-width: 1119px)';
export const reducedMotion = '(prefers-reduced-motion: reduce)';
export const reducedTransparency = '(prefers-reduced-transparency: reduce)';
export const motionOk = '(prefers-reduced-motion: no-preference)';
export const coarse = '(pointer: coarse)';
export const forcedColors = '(forced-colors: active)';

export const tablet = 'screen and (max-width: 999px)';
// two columns fold into one: the landing hero and share, the footer's floating pill
export const compact = 'screen and (max-width: 899px)';
// the landing sections and the public pages tighten their padding
export const narrow = 'screen and (max-width: 799px)';
export const phone = 'screen and (max-width: 639px)';
export const small = 'screen and (max-width: 479px)';
export const tiny = 'screen and (max-width: 379px)';

// the space between a page's content and the screen's sides
export const gutter = 'clamp(18px, 4vw, 40px)';

export const easeOut = 'cubic-bezier(.23, 1, .32, 1)';
export const easeSoft = 'cubic-bezier(.2, .8, .25, 1)';

export const focusRing = {
  outline: `2px solid ${vars.color.accent}`,
  outlineOffset: 2,
};
export const focusGlow = `0 0 0 3px color-mix(in srgb, ${vars.color.primary} 18%, transparent)`;

export const band = `color-mix(in srgb, ${vars.color.text} 4%, ${vars.color.background})`;
export const fill = `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`;
export const fillHover = `color-mix(in srgb, ${vars.color.text} 10%, ${vars.color.background})`;
export const goldBand = `color-mix(in srgb, ${vars.color.secondary} 11%, ${vars.color.background})`;

export const hatch = `repeating-linear-gradient(45deg, ${vars.color.olive} 0 2px, ${vars.color.markerAuthor} 2px 4px)`;

// the page column: the landing, the app header and footer line up on it
export const wrap = style({
  maxWidth: 1240,
  marginInline: 'auto',
  paddingInline: gutter,
});

export const headline = {
  fontFamily: vars.font.sans,
  fontWeight: 800,
  lineHeight: 1.02,
  letterSpacing: '-.03em',
  textWrap: 'balance',
} as const;

// a button, link or summary pressed down
export const pressed = { scale: '.97' } as const;

// a small icon beside a label
export const icon = { flex: 'none', width: 16, height: 16 } as const;

// a text field or checkbox with focus: the primary border and a soft glow in place of the ring
export const fieldFocus = {
  borderColor: vars.color.primary,
  outline: 'none',
  boxShadow: focusGlow,
} as const;

// a button with no look of its own: just its text, in the surrounding font
export const bareButton = {
  padding: 0,
  border: 0,
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
} as const;

export const caps = {
  color: vars.color.textMuted,
  fontSize: fontSize.label,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
} as const;

export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  margin: -1,
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

globalStyle('html', {
  scrollbarGutter: 'stable ',
});

globalStyle('html, body', {
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.sans,
});

globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle(
  ':where(a, button, input, select, textarea, summary, [tabindex]):focus-visible',
  focusRing
);

globalStyle('*, *::before, *::after', {
  '@media': {
    [reducedMotion]: {
      transitionDuration: '0s !important',
      animationDelay: '0s !important',
      animationDuration: '0s !important',
    },
  },
});

/* Every text button's size: the landing header's "Start your atlas", 18px type as it shows there. 44px tall under a finger.
   Compose it first (style([buttonSize, { … }])) and leave height, padding, type size and gap to it. */
export const buttonSize = style({
  gap: space.sp2,
  minHeight: 40,
  padding: `0 ${space.sp4}`,
  fontSize: fontSize.item,
  lineHeight: 1,
  '@media': { [coarse]: { minHeight: 44 } },
});

globalStyle(`${buttonSize} svg`, icon);
