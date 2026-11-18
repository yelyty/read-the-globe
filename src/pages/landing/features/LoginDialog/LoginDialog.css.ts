import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import { buttonSize, easeOut } from '../../../../styles/global.css';
import {
  formError as fieldFormError,
  formNotice as fieldFormNotice,
} from '../../../../components/Field/Field.css';

export const dialogSub = style({
  margin: `${space.sp2} 0 0`,
  fontSize: fontSize.action,
  color: vars.color.textSecondary,
  textWrap: 'pretty',
});

// the form's banners are Field's; here they sit above the fields
export const formError = style([
  fieldFormError,
  { margin: `0 0 ${space.sp4}` },
]);

export const formNotice = style([
  fieldFormNotice,
  { margin: `0 0 ${space.sp4}` },
]);

export const strength = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.sp2,
  marginTop: space.sp2,
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
  fontSize: fontSize.body,
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

export const btnBlock = style({ width: '100%', marginTop: space.sp2 });

export const altAction = style({
  margin: `${space.sp4} 0 0`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.4,
  color: vars.color.textSecondary,
});

export const altLink = style({
  padding: `${space.sp3} ${space.sp1}`,
  margin: `calc(${space.sp3} * -1) calc(${space.sp1} * -1)`,
  background: 'none',
  border: 0,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
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
  gap: `${space.sp2} ${space.sp4}`,
  marginTop: space.sp4,
});
globalStyle(`${links} ${altAction}`, { margin: 0 });

// "Add example books": a checkbox with its hint under the words
export const example = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: `0 ${space.sp2}`,
  margin: `0 0 ${space.sp4}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.4,
  color: vars.color.text,
  cursor: 'pointer',
});

export const exampleHint = style({
  gridColumn: 2,
  fontWeight: 400,
  fontSize: fontSize.body,
  color: vars.color.textMuted,
});
