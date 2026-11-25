import { globalStyle, keyframes, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { easeOut, phone, reducedMotion } from '../../styles/global.css';

const wide = 'screen and (min-width: 960px)';

/* ---------- Empty state ---------- */
export const empty = style({
  borderTop: `1px solid ${vars.color.border}`,
  borderBottom: `1px solid ${vars.color.border}`,
  // The lines go across the full page. The text stays in the center column of EmptyState.
  selectors: { '&&': { maxWidth: 'none' } },
});

/* ---------- Page layout ---------- */
export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: space.sp6,
  '@media': {
    [wide]: {
      gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 1fr)',
      gap: space.sp7,
      alignItems: 'start',
    },
  },
});

export const stage = style({
  padding: `${space.sp5} ${space.sp4}`,
  '@media': {
    [wide]: { position: 'sticky', top: 96 },
    [phone]: { padding: `${space.sp4} ${space.sp2}` },
  },
});

const deal = keyframes({
  from: { opacity: 0, transform: 'translateY(8px) rotate(-3deg)' },
});

// The card is at an angle. A second card in soft gold is below it.
export const card = style({
  position: 'relative',
  isolation: 'isolate',
  maxWidth: 600,
  margin: '0 auto',
  rotate: '-1.5deg',
  animation: `${deal} .28s ${easeOut} both`,
  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    borderRadius: vars.radius.sm,
    background: `color-mix(in srgb, ${vars.color.secondary} 32%, ${vars.color.background})`,
    translate: '8px 4px',
    rotate: '4.5deg',
  },
  '@media': {
    [phone]: { rotate: '-1deg' },
    [reducedMotion]: { animation: 'none' },
  },
});

globalStyle(`${card}::before`, {
  '@media': { [phone]: { translate: '4px 2px', rotate: '3deg' } },
});

export const canvas = style({
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: vars.radius.sm,
  outline: `1px solid ${vars.color.border}`,
  outlineOffset: -1,
});

export const foot = style({
  margin: `${space.sp4} 0 0`,
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
  textAlign: 'center',
});

export const send = style({ marginTop: space.sp6, paddingTop: space.sp5 });

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp4,
});

// The status line is below the Save and Share buttons.
export const status = style({
  marginTop: space.sp4,
  selectors: {
    '&&': { color: vars.color.textSecondary, fontWeight: 400 },
    '&:empty': { display: 'none' },
  },
});
