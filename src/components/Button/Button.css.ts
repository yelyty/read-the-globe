import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

import { fontSize, space, vars } from '../../styles/theme.css';
import {
  buttonSize,
  coarse,
  easeOut,
  focusRing,
  forcedColors,
  hover,
  reducedMotion,
} from '../../styles/global.css';

export const button = recipe({
  base: [
    buttonSize,
    {
      display: 'inline-flex',
      alignItems: 'center',
      border: 0,
      borderRadius: 999,
      fontFamily: vars.font.sans,
      fontWeight: 500,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: `scale .16s ${easeOut}, background-color .16s ${easeOut}`,
      ':focus-visible': focusRing,
      selectors: { '&:not(:disabled):active': { scale: '.97' } },
      '@media': { [reducedMotion]: { transition: 'none' } },
    },
  ],

  variants: {
    variant: {
      primary: {
        background: vars.color.primary,
        color: vars.color.onAccent,
        selectors: { '&[disabled]': { cursor: 'progress', opacity: 0.72 } },
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
        selectors: { '&[disabled]': { cursor: 'progress', opacity: 0.72 } },
        '@media': {
          [hover]: {
            selectors: { '&:hover': { background: vars.color.backgroundDeep } },
          },
          [forcedColors]: { border: '1px solid' },
        },
      },
      // an olive ring: a second choice beside the primary, like "Make your own goal"
      secondary: {
        background: vars.color.background,
        color: vars.color.oliveInk,
        boxShadow: `inset 0 0 0 1.5px ${vars.color.primary}`,
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
        fontSize: fontSize.body,
        color: vars.color.textSecondary,
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
        background: vars.color.background,
        boxShadow: `inset 0 0 0 1.5px ${vars.color.markerAuthor}`,
        color: vars.color.markerAuthor,
        '@media': {
          [hover]: {
            selectors: { '&:hover': { background: vars.color.rustWash } },
          },
          [forcedColors]: { border: '1.5px solid' },
        },
      },
      dangerOutline: {
        background: vars.color.background,
        boxShadow: `inset 0 0 0 1.5px ${vars.color.markerAuthor}`,
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
      outlined: {
        backgroundColor: 'transparent',
        color: vars.color.text,
        borderColor: vars.color.primary,
        selectors: {
          '&:not(:disabled):hover': {
            backgroundColor: 'rgba(0, 112, 243, 0.08)',
          },
        },
      },
      text: {
        backgroundColor: 'transparent',
        color: vars.color.primary,
        paddingInline: space.sp2,
      },
    },
    // an inline link in running text keeps its underline
    underline: {
      true: { textDecoration: 'underline', textUnderlineOffset: 3 },
    },
    size: {
      sm: {
        fontSize: fontSize.meta,
        paddingBlock: space.sp2,
        paddingInline: space.sp3,
      },
      md: {
        fontSize: fontSize.body,
        paddingBlock: space.sp3,
        paddingInline: space.sp4,
      },
      lg: {
        fontSize: fontSize.action,
        paddingBlock: space.sp4,
        paddingInline: space.sp5,
      },
    },
  },

  defaultVariants: {
    variant: 'contained',
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
