import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

import { vars } from '../../styles/theme.css';
import {
  buttonSize,
  focusRing,
  forcedColors,
  hover,
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
      ':focus-visible': focusRing,
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
        paddingInline: '0.5rem',
      },
    },
    size: {
      sm: {
        fontSize: '13px',
        paddingBlock: '0.5rem',
        paddingInline: '0.75rem',
      },
      md: {
        fontSize: '14px',
        paddingBlock: '0.75rem',
        paddingInline: '1rem',
      },
      lg: {
        fontSize: '16px',
        paddingBlock: '0.875rem',
        paddingInline: '1.5rem',
      },
    },
  },

  defaultVariants: {
    variant: 'contained',
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
