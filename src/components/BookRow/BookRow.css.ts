import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { focusRing, phone } from '../../styles/global.css';

export const list = style({ listStyle: 'none' });
export const row = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr) auto',
  gap: `${space.sp2} ${space.sp5}`,
  alignItems: 'start',
  padding: `${space.sp3} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
  '@media': {
    [phone]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: space.sp3 },
  },
});
export const rowMain = style({ minWidth: 0 });
// the cover sits to the left of the title and author, which wrap beside it
export const cover = style({
  float: 'left',
  margin: `0 ${space.sp4} ${space.sp1} 0`,
});
export const rowTitle = style({
  display: 'block',
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: fontSize.item,
  lineHeight: 1.15,
});
export const rowAuthor = style({
  display: 'block',
  marginTop: 2,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
});
export const rowMarks = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sp1,
  minWidth: 0,
  paddingTop: 2,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  '@media': { [phone]: { clear: 'both' } },
});
export const mark = style({
  display: 'flex',
  gap: space.sp2,
  alignItems: 'baseline',
  minWidth: 0,
  overflowWrap: 'anywhere',
});

export const markCountry = style({
  color: vars.color.textMuted,
  fontStyle: 'normal',
});
export const markNone = style({
  color: vars.color.textMuted,
  fontStyle: 'italic',
});

globalStyle(`${rowAuthor} time`, {
  display: 'block',
  marginTop: 2,
  color: vars.color.textMuted,
  fontSize: fontSize.meta,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});

export const rowSide = style({
  alignSelf: 'center',
  '@media': { [phone]: { alignSelf: 'auto' } },
});
export const edit = style({
  display: 'inline-flex',
  gap: space.sp2,
  alignItems: 'center',
  padding: `${space.sp2} 2px`,
  color: vars.color.textSecondary,
  fontSize: fontSize.body,
  fontWeight: 500,
  textDecoration: 'none',
  ':hover': { color: vars.color.text },
  ':focus-visible': focusRing,
});
globalStyle(`${edit} svg`, { width: 16, height: 16 });
export { srOnly } from '../../styles/global.css';
