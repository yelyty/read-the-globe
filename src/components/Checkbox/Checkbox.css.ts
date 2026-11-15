import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import {
  focusGlow,
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
  appearance: 'none',
  width: 20,
  height: 20,
  margin: 0,
  background: vars.color.background,
  border: `1.5px solid ${vars.color.fieldLine}`,
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'background-color .15s, border-color .15s, box-shadow .15s',
  ':checked': {
    background: vars.color.primary,
    borderColor: vars.color.primary,
  },
  ':focus-visible': {
    borderColor: vars.color.primary,
    boxShadow: focusGlow,
    outline: 'none',
  },
  ':disabled': { cursor: 'not-allowed', opacity: 0.5 },
  '@media': {
    [hover]: {
      selectors: {
        '&:not(:checked, :disabled):hover': {
          borderColor: vars.color.primary,
        },
        '&:checked:not(:disabled):hover': {
          background: vars.color.primaryHover,
          borderColor: vars.color.primaryHover,
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
  pointerEvents: 'none',
  opacity: 0,
  scale: 0.6,
  transition: 'opacity .12s, scale .15s',
  '@media': {
    [reducedMotion]: { transition: 'none' },
    [forcedColors]: { display: 'none' },
  },
});

globalStyle(`${box}:checked + ${tick}`, { opacity: 1, scale: 1 });
