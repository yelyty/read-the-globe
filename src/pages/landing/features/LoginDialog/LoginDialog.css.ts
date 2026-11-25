import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../../../styles/theme.css';
import { buttonSize, easeOut, pressed } from '../../../../styles/global.css';
import {
  formError as fieldFormError,
  formNotice as fieldFormNotice,
} from '../../../../components/Field/Field.css';

export const dialogSub = style({
  margin: `${space.sp2} 0 0`,
  color: vars.color.textSecondary,
  fontSize: fontSize.action,
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
  gap: space.sp2,
  alignItems: 'center',
  marginTop: space.sp2,
  selectors: { '&[hidden]': { display: 'none' } },
});

export const strengthBar = style({
  flex: 1,
  height: 4,
  overflow: 'hidden',
  borderRadius: vars.radius.pill,
  background: vars.color.backgroundDeep,
});

const strengthFillBase = style({
  width: '100%',
  height: '100%',
  borderRadius: vars.radius.pill,
  transformOrigin: 'left center',
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
  color: vars.color.textMuted,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  whiteSpace: 'nowrap',
});

const btn = style([
  buttonSize,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 0,
    borderRadius: vars.radius.pill,
    fontFamily: vars.font.sans,
    fontWeight: 500,
    textDecoration: 'none',
    transition: `scale .14s ${easeOut}, background .14s ${easeOut}`,
    cursor: 'pointer',
    selectors: {
      '&:active': pressed,
      '&[disabled]': { opacity: 0.72, cursor: 'progress' },
    },
  },
]);

export const btnPrimary = style([
  btn,
  {
    background: vars.color.primary,
    color: vars.color.onAccent,
    ':hover': { background: vars.color.primaryHover },
  },
]);

export const btnBlock = style({ width: '100%', marginTop: space.sp2 });

export const altAction = style({
  margin: `${space.sp4} 0 0`,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.4,
});

export const altLink = style({
  margin: `calc(${space.sp3} * -1) calc(${space.sp1} * -1)`,
  padding: `${space.sp3} ${space.sp1}`,
  border: 0,
  background: 'none',
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  textDecoration: 'underline',
  textUnderlineOffset: 4,
  cursor: 'pointer',
});

export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space.sp2} ${space.sp4}`,
  justifyContent: 'space-between',
  marginTop: space.sp4,
});
globalStyle(`${links} ${altAction}`, { margin: 0 });

// "Add example books": a checkbox with its hint under the words
export const example = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: `0 ${space.sp2}`,
  alignItems: 'center',
  margin: `0 0 ${space.sp4}`,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.4,
  cursor: 'pointer',
});

export const exampleHint = style({
  gridColumn: 2,
  color: vars.color.textMuted,
  fontSize: fontSize.body,
  fontWeight: 400,
});
