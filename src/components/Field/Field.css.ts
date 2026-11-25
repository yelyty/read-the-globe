import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { fieldFocus } from '../../styles/global.css';

export const note = {
  display: 'flex',
  gap: space.sp2,
  alignItems: 'flex-start',
  marginBottom: space.sp5,
  padding: `${space.sp3} ${space.sp3}`,
  borderRadius: 6,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.4,
} as const;

export const formError = style({
  ...note,
  border: `1px solid ${vars.color.markerAuthor}`,
  background: vars.color.rustWash,
  color: vars.color.error,
});

globalStyle(`${formError} svg`, {
  flex: 'none',
  width: 17,
  height: 17,
  marginTop: 1,
});

export const formNotice = style({
  ...note,
  background: vars.color.oliveWash,
  color: vars.color.oliveInk,
  fontWeight: 500,
});

export const field = style({ marginBottom: space.sp4 });
// an inline form's field: the form's grid spaces it
export const fieldCompact = style({ marginBottom: 0 });

export const fieldLabel = style({
  display: 'block',
  marginBottom: space.sp2,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.2,
  selectors: { '[data-invalid="true"] &': { color: vars.color.error } },
});

export const input = style({
  width: '100%',
  height: 48,
  padding: `0 ${space.sp4}`,
  border: `1.5px solid ${vars.color.fieldLine}`,
  borderRadius: vars.radius.md,
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  fontSize: fontSize.item,
  fontWeight: 400,
  transition: 'border-color .15s, box-shadow .15s',
  '::placeholder': { color: vars.color.textMuted, opacity: 1 },
  ':focus': fieldFocus,
  selectors: { '&[aria-invalid="true"]': { borderColor: vars.color.error } },
});

// an inline form's input: 40px tall, body-size type, on the field tint
export const inputCompact = style({
  height: 'auto',
  minHeight: 40,
  padding: `${space.sp2} ${space.sp4}`,
  background: vars.color.field,
  fontSize: fontSize.body,
});

export const inputPassword = style({ paddingRight: space.sp8 });

export const pwWrap = style({ position: 'relative' });

export const pwToggle = style({
  position: 'absolute',
  top: '50%',
  right: 8,
  height: 32,
  padding: `0 ${space.sp2}`,
  border: 0,
  borderRadius: vars.radius.sm,
  background: 'none',
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  ':hover': { color: vars.color.text },
});

export const fieldError = style({
  margin: `${space.sp2} 0 0`,
  color: vars.color.error,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.3,
});

export const fieldRequired = style({
  margin: `${space.sp2} 0 0`,
  color: vars.color.textSecondary,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.3,
});

export const strength = style({
  display: 'flex',
  gap: space.sp3,
  alignItems: 'center',
  marginTop: space.sp3,
});
