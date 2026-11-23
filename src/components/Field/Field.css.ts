import { globalStyle, style } from '@vanilla-extract/css';

import { fontSize, space, vars } from '../../styles/theme.css';
import { focusGlow } from '../../styles/global.css';

export const note = {
  display: 'flex',
  gap: space.sp2,
  alignItems: 'flex-start',
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.4,
  borderRadius: 6,
  padding: `${space.sp3} ${space.sp3}`,
  marginBottom: space.sp5,
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

export const field = style({ marginBottom: space.sp4 });
// an inline form's field: the form's grid spaces it
export const fieldCompact = style({ marginBottom: 0 });

export const fieldLabel = style({
  display: 'block',
  marginBottom: space.sp2,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.2,
  color: vars.color.textSecondary,
  selectors: { '[data-invalid="true"] &': { color: vars.color.error } },
});

export const input = style({
  width: '100%',
  height: 48,
  background: vars.color.background,
  border: `1.5px solid ${vars.color.fieldLine}`,
  borderRadius: 12,
  padding: `0 ${space.sp4}`,
  fontFamily: vars.font.sans,
  fontSize: fontSize.item,
  fontWeight: 400,
  color: vars.color.text,
  transition: 'border-color .15s, box-shadow .15s',
  '::placeholder': { color: vars.color.textMuted, opacity: 1 },
  ':focus': {
    borderColor: vars.color.primary,
    boxShadow: focusGlow,
    outline: 'none',
  },
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
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 0,
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  color: vars.color.textSecondary,
  padding: `0 ${space.sp2}`,
  height: 32,
  borderRadius: 8,
  cursor: 'pointer',
  ':hover': { color: vars.color.text },
});

export const fieldError = style({
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  fontWeight: 500,
  lineHeight: 1.3,
  color: vars.color.error,
  margin: `${space.sp2} 0 0`,
});

export const fieldRequired = style({
  fontFamily: vars.font.sans,
  fontSize: fontSize.body,
  lineHeight: 1.3,
  color: vars.color.textSecondary,
  margin: `${space.sp2} 0 0`,
});

export const strength = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.sp3,
  marginTop: space.sp3,
});
