import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { forcedColors } from '../../styles/global.css';

// a small olive tag beside the wordmark: the app is still in beta
export const betaChip = style({
  display: 'inline-flex',
  flex: 'none',
  alignItems: 'center',
  padding: `${space.sp1} ${space.sp2}`,
  borderRadius: vars.radius.pill,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  fontFamily: vars.font.sans,
  fontSize: fontSize.label,
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  '@media': {
    [forcedColors]: { border: '1px solid' },
  },
});
