import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../../../styles/theme.css';
import { buttonSize, easeOut } from '../../../../styles/global.css';

export const dialogSub = style({
  margin: '8px 0 0',
  fontSize: 16,
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});

const note = {
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
  margin: '0 0 16px',
  padding: '12px 16px',
  borderRadius: 12,
  fontFamily: vars.font.sans,
  fontSize: 15,
  lineHeight: 1.4,
} as const;

export const formError = style({
  ...note,
  color: vars.color.error,
  background: vars.color.rustWash,
  border: `1px solid ${vars.color.markerAuthor}`,
});

globalStyle(`${formError} svg`, {
  width: 17,
  height: 17,
  flex: 'none',
  marginTop: 1,
});

export const formNotice = style({
  ...note,
  fontWeight: 500,
  color: vars.color.oliveInk,
  background: vars.color.oliveWash,
});

export const strength = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
  selectors: { '&[hidden]': { display: 'none' } },
});

export const strengthBar = style({
  flex: 1,
  height: 4,
  borderRadius: 999,
  background: vars.color.backgroundDeep,
  overflow: 'hidden',
});

const strengthFillBase = style({
  height: '100%',
  width: '100%',
  transformOrigin: 'left center',
  borderRadius: 999,
  transition: `transform .2s ${easeOut}, background .2s ${easeOut}`,
});

export const strengthFill = styleVariants({
  0: [strengthFillBase, { background: vars.color.error }],
  1: [strengthFillBase, { background: vars.color.error }],
  2: [strengthFillBase, { background: vars.color.secondary }],
  3: [strengthFillBase, { background: vars.color.primary }],
  4: [strengthFillBase, { background: vars.color.primary }],
});

export const strengthLabel = style({
  fontFamily: vars.font.sans,
  fontSize: 14,
  color: vars.color.textMuted,
  whiteSpace: 'nowrap',
});

const btn = style([
  buttonSize,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    borderRadius: 999,
    fontFamily: vars.font.sans,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `transform .14s ${easeOut}, background .14s ${easeOut}`,
    selectors: {
      '&:active': { transform: 'scale(.97)' },
      '&[disabled]': { opacity: 0.72, cursor: 'progress' },
    },
  },
]);

export const btnPrimary = style([
  btn,
  {
    color: vars.color.onAccent,
    background: vars.color.primary,
    ':hover': { background: vars.color.primaryHover },
  },
]);

export const btnBlock = style({ width: '100%', marginTop: 8 });

export const altAction = style({
  margin: '16px 0 0',
  fontFamily: vars.font.sans,
  fontSize: 15,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});

export const altLink = style({
  padding: '12px 4px',
  margin: '-12px -4px',
  background: 'none',
  border: 0,
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  color: vars.color.text,
  textDecoration: 'underline',
  textUnderlineOffset: 4,
  cursor: 'pointer',
});

export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '8px 16px',
  marginTop: 16,
});
globalStyle(`${links} ${altAction}`, { margin: 0 });

// "Add example books": a checkbox with its hint under the words
export const example = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: '0 8px',
  margin: '0 0 16px',
  fontFamily: vars.font.sans,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.4,
  color: vars.color.text,
  cursor: 'pointer',
});

globalStyle(`${example} input`, {
  width: 20,
  height: 20,
  margin: 0,
  accentColor: vars.color.primary,
});

export const exampleHint = style({
  gridColumn: 2,
  fontWeight: 400,
  fontSize: 14,
  color: vars.color.textMuted,
});
