import { globalStyle, style } from '@vanilla-extract/css';
import { fontSize, space, vars } from '../../../styles/theme.css';

const wide = 'screen and (min-width: 800px)';

export const block = style({
  marginTop: space.sp6,
  paddingTop: space.sp5,
  borderTop: `1px solid ${vars.color.border}`,
  selectors: {
    '&:first-of-type': { marginTop: 0, paddingTop: 0, borderTop: 0 },
  },
  '@media': {
    [wide]: {
      display: 'grid',
      gridTemplateColumns: '170px minmax(0, 1fr)',
      columnGap: 40,
      alignItems: 'start',
    },
  },
});

export const blockTitle = style({
  margin: `0 0 ${space.sp3}`,
  fontFamily: vars.font.display,
  fontSize: fontSize.heading,
  fontWeight: 500,
  lineHeight: 1.15,
  color: vars.color.text,
  '@media': { [wide]: { gridColumn: 1, gridRow: '1 / span 8', margin: 0 } },
});

export const danger = style({ color: vars.color.markerAuthor });

globalStyle(`${block} > :not(h2)`, { '@media': { [wide]: { gridColumn: 2 } } });
