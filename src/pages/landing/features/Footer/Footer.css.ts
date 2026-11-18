import { style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import { phone } from '../../LandingPage.css';

const tablet = 'screen and (max-width: 999px)';

// the landing's own width
export { wrap } from '../../LandingPage.css';

export const footer = style({
  background: vars.color.primaryHover,
  border: `1px solid ${vars.color.primaryLine}`,
  borderRadius: '12px 12px 0 0',
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
  alignItems: 'center',
  gap: space.sp3,
  textDecoration: 'none',
});
export const logo = style({
  display: 'block',
  flex: 'none',
  width: 36,
  height: 36,
});
export const logoTitle = style({
  fontFamily: vars.font.wordmark,
  fontSize: fontSize.heading,
  color: vars.color.onAccent,
});

export const footerTag = style({
  margin: `${space.sp4} 0 0`,
  fontSize: fontSize.action,
  fontWeight: 500,
  color: vars.color.onAccentBody,
  maxWidth: 270,
});

export const footerHead = style({
  fontFamily: vars.font.sans,
  fontSize: fontSize.label,
  fontWeight: 400,
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: vars.color.onAccentMuted,
  marginBottom: space.sp3,
});

export const footerList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const footerLink = style({
  display: 'inline-block',
  padding: `${space.sp1} 0`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.action,
  fontWeight: 500,
  color: vars.color.onAccent,
  textDecoration: 'none',
  ':hover': { color: vars.color.secondaryBright, textDecoration: 'underline' },
});

export const footerTail = style({
  borderTop: `1px solid ${vars.color.primaryLine}`,
  padding: `${space.sp5} 0 ${space.sp6}`,
  paddingBottom: 'max(34px, env(safe-area-inset-bottom))',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: `${space.sp2} ${space.sp4}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.label,
  color: vars.color.onAccentMuted,
});
