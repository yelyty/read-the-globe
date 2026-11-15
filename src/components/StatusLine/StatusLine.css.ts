import { style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';

// a status, so not green: green is only for what the reader can press
export const statusLine = style({
  margin: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.oliveInk,
});
