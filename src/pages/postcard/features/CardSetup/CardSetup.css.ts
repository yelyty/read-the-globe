import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import {
  band,
  caps,
  focusRing,
  hover,
  phone,
  reducedMotion,
} from '../../../../styles/global.css';

export const picked = `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.background})`;
const pickHover = `color-mix(in srgb, ${vars.color.secondary} 16%, ${vars.color.background})`;

export const ring = `0 0 0 1px ${vars.color.border}`;
export const ringHover = `0 0 0 1px ${vars.color.textSecondary}`;
export const ringPicked = `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.text}`;

export const h2 = style({
  margin: `0 0 ${space.sp4}`,
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.15,
});

export const fields = style({ display: 'grid', gap: space.sp4, maxWidth: 440 });

export const label = style({
  ...caps,
  display: 'block',
  fontFamily: vars.font.sans,
  fontWeight: 500,
});

export const kinds = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: space.sp2,
  marginTop: space.sp2,
});

export const kind = style({
  vars: { '--mk': vars.color.markerAuthor },
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto auto',
  columnGap: space.sp4,
  alignContent: 'start',
  alignItems: 'start',
  padding: space.sp4,
  border: 0,
  borderRadius: vars.radius.lg,
  background: band,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  textAlign: 'left',
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: {
    '&[data-kind="settings"]': { vars: { '--mk': vars.color.markerSetting } },
    '&[aria-pressed="true"]': {
      boxShadow: `inset 0 0 0 1.5px ${vars.color.textSecondary}`,
      background: picked,
    },
  },
  '@media': {
    [hover]: {
      transition: 'background-color .15s ease-out',
      selectors: { '&[aria-pressed="false"]:hover': { background: pickHover } },
    },
    [reducedMotion]: { transition: 'none' },
    [phone]: { columnGap: space.sp2, padding: `${space.sp4} ${space.sp2}` },
  },
});

export const kindStamp = style({
  gridRow: '1 / 3',
  width: 32,
  height: 40,
  padding: space.sp1,
  border: '2px dotted var(--mk)',
  borderRadius: 2,
  boxShadow: `inset 0 0 0 3px ${vars.color.surface}`,
  background: 'var(--mk) content-box',
});

export const kindN = style({
  fontFamily: vars.font.display,
  fontSize: fontSize.numerals,
  fontWeight: 400,
  fontVariantNumeric: 'lining-nums tabular-nums',
  lineHeight: 1,
});

export const kindName = style({
  marginTop: space.sp1,
  color: vars.color.textSecondary,
  fontSize: fontSize.meta,
  lineHeight: 1.3,
  selectors: { [`${kind}[aria-pressed="true"] &`]: { color: vars.color.text } },
});

export const papers = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sp4,
  marginTop: space.sp2,
});

export const paper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp2,
  alignItems: 'center',
  minWidth: 64,
  padding: 0,
  border: 0,
  background: 'none',
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.meta,
  cursor: 'pointer',
  ':focus-visible': focusRing,
  selectors: {
    '&[aria-pressed="true"]': { color: vars.color.text, fontWeight: 500 },
  },
});

// The chip shows the light color of the paper, because the postcard always uses this color.
export const paperChip = style({
  width: 56,
  height: 40,
  borderRadius: vars.radius.xs,
  boxShadow: ring,
  selectors: {
    [`${paper}[aria-pressed="true"] &`]: {
      boxShadow: ringPicked,
    },
  },
  '@media': {
    [hover]: {
      selectors: {
        [`${paper}[aria-pressed="false"]:hover &`]: {
          boxShadow: ringHover,
        },
      },
    },
  },
});

// This is the Postcard menu. The reader uses it to select the card.
export const select = style({ marginTop: space.sp2 });
