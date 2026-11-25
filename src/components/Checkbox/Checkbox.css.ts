import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import {
  fieldFocus,
  forcedColors,
  hover,
  reducedMotion,
} from '../../styles/global.css';

// the box and its tick share one 20px cell, the tick drawn over the box
export const checkbox = style({
  position: 'relative',
  display: 'inline-grid',
  flex: 'none',
  width: 20,
  height: 20,
  verticalAlign: 'middle',
});

export const box = style({
  gridArea: '1 / 1',
  width: 20,
  height: 20,
  border: `1.5px solid ${vars.color.fieldLine}`,
  borderRadius: 6,
  background: vars.color.background,
  transition: 'background-color .15s, border-color .15s, box-shadow .15s',
  cursor: 'pointer',
  appearance: 'none',
  ':checked': {
    borderColor: vars.color.primary,
    background: vars.color.primary,
  },
  ':focus-visible': fieldFocus,
  ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  '@media': {
    [hover]: {
      selectors: {
        '&:not(:checked, :disabled):hover': {
          borderColor: vars.color.primary,
        },
        '&:checked:not(:disabled):hover': {
          borderColor: vars.color.primaryHover,
          background: vars.color.primaryHover,
        },
      },
    },
    [reducedMotion]: { transition: 'none' },
    // the system draws its own checkbox
    [forcedColors]: { appearance: 'auto' },
  },
});

export const tick = style({
  gridArea: '1 / 1',
  placeSelf: 'center',
  width: 14,
  height: 14,
  color: vars.color.onAccent,
  opacity: 0,
  scale: 0.6,
  transition: 'opacity .12s, scale .15s',
  pointerEvents: 'none',
  '@media': {
    [reducedMotion]: { transition: 'none' },
    [forcedColors]: { display: 'none' },
  },
});

globalStyle(`${box}:checked + ${tick}`, { opacity: 1, scale: 1 });
