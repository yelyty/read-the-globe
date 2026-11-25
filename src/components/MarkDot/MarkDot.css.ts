import { style, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import { hatch } from '../../styles/global.css';

const dot = style({
  display: 'inline-block',
  flex: 'none',
  alignSelf: 'center',
  width: 9,
  height: 9,
  borderRadius: '50%',
  verticalAlign: '0.05em',
});

// the map's marks in little: olive for a story set there, a rust ring for an author from there,
// the hatch for both, a dashed ring for an imagined world that's on no map
export const markDot = styleVariants({
  set: [dot, { background: vars.color.olive }],
  author: [dot, { boxShadow: `inset 0 0 0 2.5px ${vars.color.markerAuthor}` }],
  both: [dot, { borderRadius: 2, background: hatch }],
  imagined: [
    dot,
    {
      width: 10,
      height: 10,
      border: `1.5px dashed ${vars.color.textSecondary}`,
    },
  ],
});
