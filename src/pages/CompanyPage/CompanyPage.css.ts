import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';
import { band } from '../../styles/global.css';
import { headline } from '../LandingPage/LandingPage.css';

// one reading column in the landing's own type
export const main = style({
  width: 'min(720px, 100% - 32px)',
  marginInline: 'auto',
  padding: '72px 0 120px',
  fontFamily: vars.font.serif,
  fontSize: 18,
  lineHeight: 1.6,
  outline: 'none',
  '@media': { 'screen and (max-width: 799px)': { padding: '48px 0 96px' } },
});

globalStyle(`${main} h1`, {
  ...headline,
  margin: 0,
  fontSize: 'clamp(40px, 6vw, 64px)',
  color: vars.color.text,
});

globalStyle(`${main} h2`, {
  ...headline,
  margin: '56px 0 0',
  fontSize: 28,
  lineHeight: 1.1,
  letterSpacing: '-.02em',
  color: vars.color.text,
});

globalStyle(`${main} p, ${main} li`, {
  maxWidth: '68ch',
  color: vars.color.text,
  textWrap: 'pretty',
});

globalStyle(`${main} :is(p, h2, ul) + p`, { marginTop: 16 });
globalStyle(`${main} ul`, { margin: '16px 0 0', paddingLeft: 24 });
globalStyle(`${main} li + li`, { marginTop: 8 });
globalStyle(`${main} a`, { color: vars.color.text, textUnderlineOffset: 4 });

export const draft = style({
  display: 'inline-block',
  marginBottom: 24,
  padding: '4px 12px',
  borderRadius: 999,
  background: band,
  fontFamily: vars.font.sans,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});

export const lede = style({ fontSize: 21, lineHeight: 1.5 });

globalStyle(`${main} p${lede}`, {
  marginTop: 24,
  color: vars.color.textSecondary,
});

export const meta = style({
  fontFamily: vars.font.sans,
  fontSize: 15,
  lineHeight: 1.4,
});
globalStyle(`${main} p${meta}`, { marginTop: 16, color: vars.color.textMuted });

/* the journal's posts: flat cards on the band's fill */
export const posts = style({ display: 'grid', gap: 16, listStyle: 'none' });
globalStyle(`${main} ul${posts}`, { margin: '48px 0 0', padding: 0 });
export const post = style({
  padding: 32,
  borderRadius: 16,
  background: band,
  '@media': { 'screen and (max-width: 799px)': { padding: 24 } },
});
globalStyle(`${main} ${posts} li`, { maxWidth: 'none' });
globalStyle(`${main} ${posts} li + li`, { marginTop: 0 });

globalStyle(`${post} time`, {
  fontFamily: vars.font.sans,
  fontSize: 15,
  lineHeight: 1,
  color: vars.color.textMuted,
  fontVariantNumeric: 'tabular-nums',
});

globalStyle(`${main} ${post} h2`, { marginTop: 8 });

globalStyle(`${main} ${post} p`, {
  marginTop: 16,
  color: vars.color.textSecondary,
});

/* the contact form */
export const form = style({
  display: 'grid',
  gap: 0,
  maxWidth: 520,
  marginTop: 40,
});
export const textarea = style({
  display: 'block',
  height: 'auto',
  minHeight: 160,
  paddingBlock: 12,
  lineHeight: 1.4,
  resize: 'vertical',
});
export const send = style({ justifySelf: 'start', marginTop: 8 });
export const sent = style({
  marginTop: 24,
  padding: '16px 24px',
  borderRadius: 16,
  background: vars.color.oliveWash,
  fontFamily: vars.font.sans,
  fontSize: 17,
  fontWeight: 500,
  lineHeight: 1.4,
  outline: 'none',
});
