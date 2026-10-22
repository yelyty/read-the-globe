import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { headline } from "../LandingPage/LandingPage.css";

export const main = style({
	maxWidth: "44rem",
	marginInline: "auto",
	padding: "40px clamp(18px, 4vw, 40px) 80px",
	fontFamily: vars.font.serif,
	fontSize: 18,
	lineHeight: 1.6,
	outline: "none",
});

globalStyle(`${main} h1`, {
	...headline,
	margin: "0 0 8px",
	color: vars.color.text,
});
globalStyle(`${main} h2`, {
	...headline,
	margin: "40px 0 8px",
	fontSize: 28,
	lineHeight: 1.1,
	letterSpacing: "-.02em",
	color: vars.color.text,
});
globalStyle(`${main} p, ${main} li`, { color: vars.color.text });
globalStyle(`${main} a`, { color: vars.color.accent, textUnderlineOffset: 3 });
globalStyle(`${main} code`, {
	fontSize: "0.85em",
	padding: "1px 5px",
	borderRadius: 4,
	background: vars.color.surface,
});
globalStyle(`${main} table`, {
	width: "100%",
	marginTop: 12,
	borderCollapse: "collapse",
	fontSize: "0.95rem",
});
globalStyle(`${main} th, ${main} td`, {
	padding: "10px 12px 10px 0",
	textAlign: "left",
	verticalAlign: "top",
	borderBottom: `1px solid ${vars.color.border}`,
});
globalStyle(`${main} th`, {
	fontFamily: vars.font.sans,
	fontWeight: 500,
	color: vars.color.textSecondary,
});

export const lede = style({
	fontSize: "1.15rem",
	color: vars.color.textSecondary,
});
globalStyle(`${main} p${lede}`, { color: vars.color.textSecondary });
export const updated = style({ margin: "0 0 32px", fontSize: "0.95rem" });
globalStyle(`${main} p${updated}`, { color: vars.color.textMuted });
