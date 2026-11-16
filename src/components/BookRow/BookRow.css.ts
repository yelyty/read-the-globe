import { globalStyle, style } from '@vanilla-extract/css';

import { vars } from '../../styles/theme.css';
import { focusRing, phone } from '../../styles/global.css';

export const list = style({ listStyle: 'none', margin: 0, padding: 0 });
export const row = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr) auto',
  gap: '8px 24px',
  alignItems: 'start',
  padding: '12px 0',
  borderBottom: `1px solid ${vars.color.border}`,
  '@media': { [phone]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: 10 } },
});
export const rowMain = style({ minWidth: 0 });
// the cover sits to the left of the title and author, which wrap beside it
export const cover = style({
  float: 'left',
  margin: '0 14px 4px 0',
});
export const rowTitle = style({
  display: 'block',
  fontFamily: vars.font.display,
  fontSize: 18,
  lineHeight: 1.15,
  color: vars.color.text,
});
export const rowAuthor = style({
  display: 'block',
  marginTop: 2,
  fontSize: 14,
  color: vars.color.textSecondary,
});
export const rowMarks = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
  paddingTop: 2,
  fontSize: 14,
  color: vars.color.textSecondary,
  '@media': { [phone]: { clear: 'both' } },
});
export const mark = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
  minWidth: 0,
  overflowWrap: 'anywhere',
});

export const markCountry = style({
  fontStyle: 'normal',
  color: vars.color.textMuted,
});
export const markNone = style({
  fontStyle: 'italic',
  color: vars.color.textMuted,
});

globalStyle(`${rowAuthor} time`, {
  display: 'block',
  marginTop: 2,
  fontSize: 13,
  color: vars.color.textMuted,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
});

export const rowSide = style({
  alignSelf: 'center',
  '@media': { [phone]: { alignSelf: 'auto' } },
});
export const edit = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 2px',
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.textSecondary,
  textDecoration: 'none',
  ':hover': { color: vars.color.text },
  ':focus-visible': focusRing,
});
globalStyle(`${edit} svg`, { width: 16, height: 16 });
export { srOnly } from '../../styles/global.css';
