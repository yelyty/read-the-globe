import { globalStyle, style } from '@vanilla-extract/css';
import { fontSize, vars } from './theme.css';

export const hover = '(hover: hover)';
export const narrowNav = 'screen and (max-width: 1119px)';
export const reducedMotion = '(prefers-reduced-motion: reduce)';
export const coarse = '(pointer: coarse)';
export const forcedColors = '(forced-colors: active)';

export const tablet = 'screen and (max-width: 999px)';
export const phone = 'screen and (max-width: 639px)';
export const small = 'screen and (max-width: 479px)';
export const tiny = 'screen and (max-width: 379px)';

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

export const caps = {
  fontSize: fontSize.label,
  letterSpacing: 1.4,
  textTransform: 'uppercase',
  color: vars.color.textMuted,
} as const;

export const srOnly = style({
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
});

globalStyle('html', {
  scrollbarGutter: 'stable ',
});

globalStyle('html, body', {
  margin: 0,
  fontFamily: vars.font.sans,
  background: vars.color.background,
  color: vars.color.text,
});

globalStyle('*', {
  boxSizing: 'border-box',
});
