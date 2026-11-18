import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { band } from '../../styles/global.css';
import { headline } from '../../pages/landing/LandingPage.css';

// one reading column in the landing's own type
export const main = style({
  width: 'min(720px, 100% - 32px)',
  marginInline: 'auto',
  padding: `${space.sp8} 0 120px`,
  fontFamily: vars.font.serif,
  fontSize: fontSize.item,
  lineHeight: 1.6,
  outline: 'none',
  '@media': {
    'screen and (max-width: 799px)': { padding: `${space.sp7} 0 ${space.sp9}` },
  },
});

globalStyle(`${main} h1`, {
  ...headline,
  margin: 0,
  fontSize: 'clamp(40px, 6vw, 64px)',
  color: vars.color.text,
});

globalStyle(`${main} h2`, {
  ...headline,
  margin: `${space.sp8} 0 0`,
  fontSize: fontSize.title,
  lineHeight: 1.1,
  letterSpacing: '-.02em',
  color: vars.color.text,
});

globalStyle(`${main} p, ${main} li`, {
  maxWidth: '68ch',
  color: vars.color.text,
  textWrap: 'pretty',
});

globalStyle(`${main} :is(p, h2, ul) + p`, { marginTop: space.sp4 });

globalStyle(`${main} ul`, {
  margin: `${space.sp4} 0 0`,
  paddingLeft: space.sp5,
});

globalStyle(`${main} li + li`, { marginTop: space.sp2 });
globalStyle(`${main} a`, { color: vars.color.text, textUnderlineOffset: 4 });

export const draft = style({
  display: 'inline-block',
  marginBottom: space.sp5,
  padding: `${space.sp1} ${space.sp3}`,
  borderRadius: 999,
  background: band,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});

export const lede = style({ fontSize: fontSize.heading, lineHeight: 1.5 });

globalStyle(`${main} p${lede}`, {
  marginTop: space.sp5,
  color: vars.color.textSecondary,
});

export const meta = style({
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.4,
});

globalStyle(`${main} p${meta}`, {
  marginTop: space.sp4,
  color: vars.color.textMuted,
});

/* the journal's posts: flat cards on the band's fill */
export const posts = style({
  display: 'grid',
  gap: space.sp4,
  listStyle: 'none',
});
globalStyle(`${main} ul${posts}`, { margin: `${space.sp7} 0 0`, padding: 0 });
export const post = style({
  padding: space.sp6,
  borderRadius: 16,
  background: band,
  '@media': { 'screen and (max-width: 799px)': { padding: space.sp5 } },
});
globalStyle(`${main} ${posts} li`, { maxWidth: 'none' });
globalStyle(`${main} ${posts} li + li`, { marginTop: 0 });

globalStyle(`${post} time`, {
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1,
  color: vars.color.textMuted,
  fontVariantNumeric: 'tabular-nums',
});

globalStyle(`${main} ${post} h2`, { marginTop: space.sp2 });

globalStyle(`${main} ${post} p`, {
  marginTop: space.sp4,
  color: vars.color.textSecondary,
});

/* the contact form */
export const form = style({
  display: 'grid',
  gap: 0,
  maxWidth: 520,
  marginTop: space.sp7,
});
export const textarea = style({
  display: 'block',
  height: 'auto',
  minHeight: 160,
  paddingBlock: space.sp3,
  lineHeight: 1.4,
  resize: 'vertical',
});
export const send = style({ justifySelf: 'start', marginTop: space.sp2 });
export const sent = style({
  marginTop: space.sp5,
  padding: `${space.sp4} ${space.sp5}`,
  borderRadius: 16,
  background: vars.color.oliveWash,
  fontFamily: vars.font.sans,
  fontSize: fontSize.item,
  fontWeight: 500,
  lineHeight: 1.4,
  outline: 'none',
});
