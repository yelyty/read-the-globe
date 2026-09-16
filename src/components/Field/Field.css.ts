import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";
import { label } from "../../LandingPage/temp.css";

export const note = {
	display: "flex",
	gap: 9,
	alignItems: "flex-start",
	fontFamily: vars.font.sans,
	fontSize: 14,
	lineHeight: 1.4,
	borderRadius: 6,
	padding: "11px 13px",
	marginBottom: 20,
} as const;

export const formError = style({
	...note,
	color: vars.color.error,
	background: vars.color.rustWash,
	border: `1px solid ${vars.color.markerAuthor}`,
});
globalStyle(`${formError} svg`, { width: 17, height: 17, flex: "none", marginTop: 1 });

export const formNotice = style({
	...note,
	fontWeight: 500,
	color: vars.color.oliveInk,
	background: vars.color.oliveWash,
});

export const field = style({ marginBottom: 14 });

export const fieldLabel = style([
	label,
	{
		display: "block",
		marginBottom: 7,
		selectors: { '[data-invalid="true"] &': { color: vars.color.error } },
	},
]);

export const input = style({
	width: "100%",
	background: vars.color.field,
	border: `1.5px solid ${vars.color.fieldLine}`,
	borderRadius: 6,
	padding: "15px 16px",
	fontFamily: vars.font.sans,
	fontSize: 16,
	fontWeight: 500,
	color: vars.color.text,
	transition: "border-color .15s, box-shadow .15s",
	"::placeholder": { color: vars.color.textMuted, opacity: 1 },
	":focus": {
		borderColor: vars.color.primary,
		boxShadow: "0 0 0 3px rgba(74, 106, 64, 0.18)",
		outline: "none",
	},
	selectors: { '&[aria-invalid="true"]': { borderColor: vars.color.error } },
});

export const inputPassword = style({ paddingRight: 78 });

export const pwWrap = style({ position: "relative" });

export const pwToggle = style({
	position: "absolute",
	right: 8,
	top: "50%",
	transform: "translateY(-50%)",
	background: "none",
	border: 0,
	fontFamily: vars.font.sans,
	fontSize: 13,
	fontWeight: 500,
	color: vars.color.textSecondary,
	padding: 10,
	minHeight: 40,
	borderRadius: 6,
	cursor: "pointer",
	":hover": { color: vars.color.text },
});

export const fieldError = style({
	fontFamily: vars.font.sans,
	fontSize: 13,
	color: vars.color.error,
	margin: "7px 0 0 3px",
});

export const strength = style({
	display: "flex",
	alignItems: "center",
	gap: 10,
	marginTop: 10,
});