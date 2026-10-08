import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const menu = style({ position: "relative" });

export const button = style({
	display: "inline-flex",
	alignItems: "center",
	gap: 5,
	minHeight: 40,
	padding: 0,
	background: "none",
	border: 0,
	fontFamily: vars.font.sans,
	fontSize: 15.5,
	fontWeight: 500,
	color: vars.color.textSecondary,
	cursor: "pointer",
	selectors: {
		'&:hover, &[aria-expanded="true"]': { color: vars.color.text },
		"&[data-current]": {
			color: vars.color.text,
			textDecoration: "underline",
			textDecorationThickness: 1.5,
			textUnderlineOffset: 7,
		},
		"&:focus-visible": {
			outline: `2px solid ${vars.color.accent}`,
			outlineOffset: 4,
			borderRadius: 4,
		},
	},
});

export const caret = style({
	width: 12,
	height: 12,
	transition: "rotate .2s ease",
	selectors: { [`${button}[aria-expanded="true"] &`]: { rotate: "180deg" } },
	"@media": { "(prefers-reduced-motion: reduce)": { transition: "none" } },
});

export const list = style({
	position: "absolute",
	right: -12,
	top: "calc(100% + 10px)",
	zIndex: 80,
	minWidth: 176,
	margin: 0,
	padding: 4,
	listStyle: "none",
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.md,
	boxShadow: `0 14px 30px -16px rgba(${vars.shadow.ink}, .45)`,
	selectors: { "&[hidden]": { display: "none" } },
});

export const item = style({
	display: "flex",
	alignItems: "center",
	width: "100%",
	minHeight: 40,
	padding: "0 12px",
	border: 0,
	borderRadius: 6,
	background: "none",
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textSecondary,
	textDecoration: "none",
	textAlign: "left",
	cursor: "pointer",
	selectors: {
		"&:hover, &:focus-visible": {
			background: vars.color.backgroundDeep,
			color: vars.color.text,
			outline: "none",
		},
	},
});
