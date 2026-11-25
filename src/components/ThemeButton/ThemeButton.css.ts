import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import { coarse, hover, phone } from '../../styles/global.css';

export const themeBtn = style({
  display: 'grid',
  flex: 'none',
  placeItems: 'center',
  width: 40,
  height: 40,
  border: 0,
  borderRadius: vars.radius.pill,
  background: `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`,
  // the same as the nav links beside it
  color: vars.color.textSecondary,
  cursor: 'pointer',
  '@media': {
    [hover]: {
      selectors: {
        '&:hover': {
          background: `color-mix(in srgb, ${vars.color.text} 10%, ${vars.color.background})`,
        },
      },
    },
    [coarse]: { width: 44, height: 44 },
    // TODO: add other breakpoints
    [phone]: { marginLeft: 'auto' },
  },
});
globalStyle(`${themeBtn} svg`, { width: 19, height: 19 });
