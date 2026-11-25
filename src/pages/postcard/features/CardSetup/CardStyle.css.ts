import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  coarse,
  easeOut,
  focusRing,
  hover,
} from '../../../../styles/global.css';
import { label, picked, ring, ringHover, ringPicked } from './CardSetup.css';

export const options = style({});

export const summary = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'center',
  width: 'fit-content',
  minHeight: 40,
  marginTop: space.sp4,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  listStyle: 'none',
  cursor: 'pointer',
  // This caret is the same as the caret of Show countries.
  '::before': {
    content: '""',
    width: 7,
    height: 7,
    borderRight: `1.5px solid ${vars.color.textMuted}`,
    borderBottom: `1.5px solid ${vars.color.textMuted}`,
    rotate: '-45deg',
    transition: `rotate .18s ${easeOut}`,
  },
  '@media': { [coarse]: { minHeight: 44 } },
});
globalStyle(`${summary}::-webkit-details-marker`, { display: 'none' });
globalStyle(`${options}[open] > ${summary}::before`, { rotate: '45deg' });

export const summaryNote = style({
  color: vars.color.textMuted,
  fontWeight: 400,
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  alignItems: 'center',
  marginTop: space.sp4,
});

export const rowLabel = style([label, { width: 88 }]);

export const pills = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: space.sp2,
});

export const pill = style({
  minHeight: 36,
  padding: `${space.sp2} ${space.sp4}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  background: 'none',
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: {
    '&[aria-pressed="true"]': {
      borderColor: 'transparent',
      background: picked,
      color: vars.color.text,
    },
  },
  '@media': {
    [hover]: {
      selectors: { '&:hover': { background: picked, color: vars.color.text } },
    },
    [coarse]: { minHeight: 44 },
  },
});

export const swatches = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: space.sp2,
  paddingLeft: space.sp2,
  '@media': { [coarse]: { gap: space.sp4 } },
});

export const swatch = style({
  position: 'relative',
  width: 32,
  height: 32,
  padding: 0,
  border: `2px solid ${vars.color.surface}`,
  borderRadius: '50%',
  boxShadow: ring,
  transition: `box-shadow .15s ${easeOut}`,
  cursor: 'pointer',
  // The touch area is 40 px. It does not overlap the adjacent swatches.
  '::before': {
    content: '""',
    position: 'absolute',
    inset: -5,
    borderRadius: '50%',
  },
  ':focus-visible': {
    outline: `2px solid ${vars.color.accent}`,
    outlineOffset: 3,
  },
  selectors: {
    '&[aria-pressed="true"]': {
      boxShadow: ringPicked,
    },
  },
  '@media': {
    [hover]: {
      selectors: {
        '&[aria-pressed="false"]:hover': {
          boxShadow: ringHover,
        },
      },
    },
  },
});

export const colorName = style({
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
});
