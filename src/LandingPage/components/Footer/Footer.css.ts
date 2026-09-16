import { style } from "@vanilla-extract/css";
import { vars } from "../../../theme.css";

export const wrap = style({
	maxWidth: 1240,
	marginInline: "auto",
	paddingInline: "clamp(18px, 4vw, 40px)",
});

export const footer = style({
	background: vars.color.primaryHover,
	border: `1px solid ${vars.color.primaryLine}`,
	borderRadius: "12px 12px 0 0",
});

export const footerGrid = style({
	display: "grid",
	gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
	gap: 32,
	padding: "54px 0 30px",
});

export const footerTag = style({
	marginTop: 16,
	fontSize: 16,
	fontWeight: 500,
	color: vars.color.onAccentBody,
	maxWidth: 270,
});

export const footerHead = style({
	fontFamily: vars.font.sans,
	fontSize: 12,
	fontWeight: 400,
	letterSpacing: "1.8px",
	textTransform: "uppercase",
	color: vars.color.onAccentMuted,
	marginBottom: 10,
});

export const footerList = style({
	listStyle: "none",
	margin: 0,
	padding: 0,
	display: "flex",
	flexDirection: "column",
	gap: 2,
});

export const footerLink = style({
	display: "inline-block",
	padding: "4px 0",
	fontFamily: vars.font.sans,
	fontSize: 15.5,
	fontWeight: 500,
	color: vars.color.onAccent,
	textDecoration: "none",
	":hover": { color: vars.color.secondaryBright, textDecoration: "underline" },
});

export const footerTail = style({
	borderTop: `1px solid ${vars.color.primaryLine}`,
	padding: "20px 0 34px",
	paddingBottom: "max(34px, env(safe-area-inset-bottom))",
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "8px 18px",
	fontFamily: vars.font.sans,
	fontSize: 12,
	color: vars.color.onAccentMuted,
});
