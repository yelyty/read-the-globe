import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const head = style({
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "space-between",
	alignItems: "flex-end",
	gap: "12px 32px",
	paddingBlock: "28px 20px",
	borderBottom: `1px solid ${vars.color.border}`,
});

export const title = style({
	fontFamily: vars.font.display,
	fontWeight: 500,
	fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
	lineHeight: 1.1,
	color: vars.color.text,
});

export const firstRun = style({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "14px 28px",
	marginTop: 24,
	padding: "18px 22px",
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.md,
});
globalStyle(`${firstRun} p`, {
	flex: "1 1 320px",
	fontFamily: vars.font.serif,
	fontSize: 18,
	lineHeight: 1.5,
	color: vars.color.textSecondary,
});

// the same filled pill as "Log a book" in the header
export const primary = style({
	display: "inline-flex",
	alignItems: "center",
	minHeight: 40,
	padding: "11px 22px",
	borderRadius: 999,
	background: vars.color.primary,
	color: vars.color.onAccent,
	fontFamily: vars.font.sans,
	fontWeight: 500,
	fontSize: 15,
	textDecoration: "none",
	":hover": { background: vars.color.primaryHover },
});

export const recent = style({
	paddingBottom: 48,
});

export const subHead = style({
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "space-between",
	alignItems: "baseline",
	gap: 12,
	paddingBottom: 10,
	marginBottom: 16,
	borderBottom: `1px solid ${vars.color.border}`,
});

export const subTitle = style({
	fontFamily: vars.font.display,
	fontWeight: 500,
	fontSize: "1.35rem",
	color: vars.color.text,
});

export const more = style({
	fontFamily: vars.font.sans,
	fontSize: 15,
	color: vars.color.accent,
});