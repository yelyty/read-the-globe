import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import { phone, tablet } from '../../../../styles/global.css';

// the landing's own width
export { wrap } from '../../../../styles/global.css';

export const footer = style({
  border: `1px solid ${vars.color.primaryLine}`,
  borderRadius: `${vars.radius.md} ${vars.radius.md} 0 0`,
  background: vars.color.primaryHover,
});

export const footerGrid = style({
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
  gap: space.sp6,
  padding: `${space.sp7} 0 ${space.sp6}`,
  '@media': {
    [tablet]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
    [phone]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
});

export const logoLink = style({
  display: 'inline-flex',
  gap: space.sp3,
  alignItems: 'center',
  textDecoration: 'none',
});
export const logo = style({
  display: 'block',
  flex: 'none',
  width: 36,
  height: 36,
});
export const logoTitle = style({
  color: vars.color.onAccent,
  fontFamily: vars.font.wordmark,
  fontSize: fontSize.heading,
});

export const footerTag = style({
  maxWidth: 270,
  margin: `${space.sp4} 0 0`,
  color: vars.color.onAccentBody,
  fontSize: fontSize.action,
  fontWeight: 500,
});

export const footerHead = style({
  marginBottom: space.sp3,
  color: vars.color.onAccentMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.label,
  fontWeight: 400,
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
});

export const footerList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  listStyle: 'none',
});

export const footerLink = style({
  display: 'inline-block',
  padding: `${space.sp1} 0`,
  color: vars.color.onAccent,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  textDecoration: 'none',
  ':hover': { color: vars.color.secondaryBright, textDecoration: 'underline' },
});

export const footerTail = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${space.sp5} 0 ${space.sp6}`,
  paddingBottom: 'max(34px, env(safe-area-inset-bottom))',
  borderTop: `1px solid ${vars.color.primaryLine}`,
  color: vars.color.onAccentMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.label,
});
