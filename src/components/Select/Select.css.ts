import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import {
  coarse,
  easeOut,
  fill,
  fillHover,
  focusRing,
  hover,
  reducedMotion,
} from '../../styles/global.css';
import { input } from '../Field/Field.css';

// the footer's type sits on the wrapper too: the landing page has its buttons inherit font and colour
export const wrap = styleVariants({
  compact: {},
  field: {},
  pill: {},
  footer: { fontSize: 15, fontWeight: 500, color: vars.color.onAccent },
});

/* the button: the chosen option, then a caret with room to breathe on the right */
const triggerBase = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontFamily: vars.font.sans,
  textAlign: 'left',
  cursor: 'pointer',
  ':focus-visible': focusRing,
  ':disabled': { cursor: 'not-allowed', opacity: 0.6 },
});

export const trigger = styleVariants({
  // a small box, as in the account menu's language row
  compact: [
    triggerBase,
    {
      minHeight: 32,
      padding: '0 10px',
      border: `1px solid ${vars.color.border}`,
      borderRadius: 8,
      background: vars.color.background,
      fontSize: 15,
      color: vars.color.text,
    },
  ],
  // a form field, like the text inputs beside it
  field: [input, triggerBase, { padding: '0 14px 0 16px' }],
  // a filled pill, as in the Shelf's filters
  pill: [
    triggerBase,
    {
      minHeight: 40,
      padding: '0 14px 0 16px',
      border: 0,
      borderRadius: 999,
      background: fill,
      fontSize: 15,
      color: vars.color.textSecondary,
      '@media': {
        [hover]: {
          selectors: { '&:hover:not(:disabled)': { background: fillHover } },
        },
        [coarse]: { minHeight: 44 },
      },
    },
  ],
  // the landing footer's tail, on the green: a quiet outlined box
  footer: [
    triggerBase,
    {
      height: 40,
      minWidth: 160,
      padding: '0 14px 0 16px',
      border: `1.5px solid ${vars.color.onAccentMuted}`,
      borderRadius: 8,
      background: vars.color.primary,
      fontSize: 15,
      fontWeight: 500,
      color: vars.color.onAccent,
      ':focus-visible': {
        outline: `2px solid ${vars.color.secondaryBright}`,
        outlineOffset: 2,
      },
      '@media': {
        [hover]: {
          selectors: { '&:hover': { background: vars.color.primaryHover } },
        },
      },
    },
  ],
});

// the chosen option's words: cut short with an ellipsis rather than pushing the caret out
export const value = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const caret = style({
  flex: 'none',
  width: 14,
  height: 14,
  transition: `rotate .2s ${easeOut}`,
  selectors: { '[aria-expanded="true"] > &': { rotate: '180deg' } },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

/* the list: a card like the account menu's, in the top layer (a popover) so no dialog or scroll box clips it;
   Select places it under the button, or over it where there's no room below */
const listIn = keyframes({ from: { opacity: 0, transform: 'scale(.97)' } });

export const list = style({
  position: 'fixed',
  inset: 'auto',
  margin: 0,
  maxHeight: 320,
  overflowY: 'auto',
  padding: 4,
  listStyle: 'none',
  background: vars.color.surface,
  color: vars.color.text,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0, 0, 0, .12)',
  animation: `${listIn} .15s ${easeOut}`,
  ':focus-visible': { outline: 'none' }, // the active option shows where focus is
  '@media': { [reducedMotion]: { animation: 'none' } },
});

export const option = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  minHeight: 40,
  padding: '0 12px',
  borderRadius: 8,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  color: vars.color.textSecondary,
  cursor: 'pointer',
  selectors: {
    '&[aria-selected="true"]': { color: vars.color.text },
    '&[data-active]': {
      background: vars.color.primary,
      color: vars.color.onAccent,
    },
  },
});

export const check = style({ flex: 'none', width: 16, height: 16 });
