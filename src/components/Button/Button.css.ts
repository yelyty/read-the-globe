import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  buttonSize,
  coarse,
  easeOut,
  focusRing,
  forcedColors,
  hover,
  pressed,
  reducedMotion,
} from '../../styles/global.css';

export const button = recipe({
  base: [
    buttonSize,
    {
      display: 'inline-flex',
      alignItems: 'center',
      border: 0,
      borderRadius: vars.radius.pill,
      fontFamily: vars.font.sans,
      fontWeight: 500,
      textDecoration: 'none',
      transition: `scale .16s ${easeOut}, background-color .16s ${easeOut}`,
      cursor: 'pointer',
      ':focus-visible': focusRing,
      selectors: { '&:not(:disabled):active': pressed },
      '@media': { [reducedMotion]: { transition: 'none' } },
    },
  ],

  variants: {
    variant: {
      primary: {
        background: vars.color.primary,
        color: vars.color.onAccent,
        selectors: { '&[disabled]': { opacity: 0.72, cursor: 'progress' } },
        '@media': {
          [hover]: {
            selectors: {
              '&:not([disabled]):hover': {
                background: vars.color.primaryHover,
              },
            },
          },
        },
      },
      // a quiet neutral button beside a primary one: the postcard's Share
      neutral: {
        boxShadow: `inset 0 0 0 1px ${vars.color.border}`,
        background: vars.color.surface,
        color: vars.color.text,
        selectors: { '&[disabled]': { opacity: 0.72, cursor: 'progress' } },
        '@media': {
          [hover]: {
            selectors: { '&:hover': { background: vars.color.backgroundDeep } },
          },
          [forcedColors]: { border: '1px solid' },
        },
      },
      // an olive ring: a second choice beside the primary, like "Make your own goal"
      secondary: {
        boxShadow: `inset 0 0 0 1.5px ${vars.color.primary}`,
        background: vars.color.background,
        color: vars.color.oliveInk,
        selectors: { '&[disabled]': { opacity: 0.5, cursor: 'not-allowed' } },
        '@media': {
          [hover]: {
            selectors: {
              '&:not([disabled]):hover': { background: vars.color.oliveWash },
            },
          },
          [forcedColors]: { border: '1.5px solid' },
        },
      },
      // a button that reads as a link: grey text with an icon, no pill
      link: {
        minHeight: 0,
        padding: `${space.sp2} 2px`,
        borderRadius: 0,
        background: 'none',
        color: vars.color.textSecondary,
        fontSize: fontSize.body,
        whiteSpace: 'nowrap',
        selectors: {
          '&:active': { scale: '1' },
          '&[disabled]': { opacity: 0.6, cursor: 'not-allowed' },
        },
        '@media': {
          [hover]: { selectors: { '&:hover': { color: vars.color.text } } },
          [coarse]: { minHeight: 44 },
        },
      },
      quiet: {
        boxShadow: `inset 0 0 0 1.5px ${vars.color.markerAuthor}`,
        background: vars.color.background,
        color: vars.color.markerAuthor,
        '@media': {
          [hover]: {
            selectors: { '&:hover': { background: vars.color.rustWash } },
          },
          [forcedColors]: { border: '1.5px solid' },
        },
      },
      dangerOutline: {
        boxShadow: `inset 0 0 0 1.5px ${vars.color.markerAuthor}`,
        background: vars.color.background,
        color: vars.color.markerAuthor,
        '@media': {
          [hover]: {
            selectors: { '&:hover': { background: vars.color.rustWash } },
          },
          [forcedColors]: { border: '1.5px solid' },
        },
      },
      danger: {
        background: vars.color.markerAuthor,
        color: vars.color.background,
        selectors: { '&[disabled]': { opacity: 0.5, cursor: 'not-allowed' } },
        '@media': {
          [hover]: {
            selectors: {
              '&:not([disabled]):hover': {
                background: `color-mix(in srgb, ${vars.color.markerAuthor} 82%, ${vars.color.text})`,
              },
            },
          },
        },
      },
      contained: {
        backgroundColor: vars.color.primary,
        color: vars.color.onAccent,
        selectors: {
          '&:not(:disabled):hover': {
            backgroundColor: vars.color.primaryHover,
          },
        },
      },
      text: {
        paddingInline: space.sp2,
        backgroundColor: 'transparent',
        color: vars.color.primary,
      },
    },
    // an inline link in running text keeps its underline
    underline: {
      true: { textDecoration: 'underline', textUnderlineOffset: 3 },
    },
    size: {
      sm: {
        paddingBlock: space.sp2,
        paddingInline: space.sp3,
        fontSize: fontSize.meta,
      },
      md: {
        paddingBlock: space.sp3,
        paddingInline: space.sp4,
        fontSize: fontSize.body,
      },
      lg: {
        paddingBlock: space.sp4,
        paddingInline: space.sp5,
        fontSize: fontSize.action,
      },
    },
  },

  defaultVariants: {
    variant: 'contained',
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
