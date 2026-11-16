import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import { forcedColors } from '../../styles/global.css';

// a small olive tag beside the wordmark: the app is still in beta
export const betaChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  flex: 'none',
  padding: '3px 8px',
  borderRadius: 999,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  fontFamily: vars.font.sans,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  '@media': {
    [forcedColors]: { border: '1px solid' },
  },
});
