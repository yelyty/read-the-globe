import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { hover, reducedMotion } from "../../styles/global.css";
import { wrap } from "../../pages/LandingPage/LandingPage.css";

const wide = "screen and (min-width: 1120px)";
const phone = "screen and (max-width: 639px)";
const tiny = "screen and (max-width: 379px)";
const fill = `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`;
const fillHover = `color-mix(in srgb, ${vars.color.text} 10%, ${vars.color.background})`;

export const row = style([
	wrap,
	{
		position: "relative",
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		gap: "0 24px",
		minHeight: 72,
		// phones: logo and tools on the first row, the nav on its own row under them
		"@media": { [phone]: { minHeight: 0, gap: 8, paddingTop: 16 } },
	},
]);


export const nav = style({
	display: "flex",
	gap: 4,
	marginLeft: "auto",
	padding: 4,
	borderRadius: 999,
	background: fill,
	"@media": {
		[wide]: { position: "absolute", left: "50%", translate: "-50% 0", marginLeft: 0 },
		[phone]: { order: 10, flexBasis: "100%", gap: 2, margin: "0 0 8px" },
		[tiny]: { gap: 0 },
	},
});

export const navLink = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minHeight: 40,
	padding: "0 16px",
	border: 0,
	borderRadius: 999,
	background: "none",
	fontFamily: vars.font.sans,
	fontSize: 16,
	fontWeight: 500,
	lineHeight: 1,
	color: vars.color.textSecondary,
	textDecoration: "none",
	whiteSpace: "nowrap",
	cursor: "pointer",
	transition: "background-color .15s ease-out, color .15s ease-out",
	selectors: {
		'&[aria-current="page"]': { background: vars.color.background, color: vars.color.text },
	},
	":focus-visible": { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2 },
	"@media": {
		[hover]: { selectors: { '&:not([aria-current="page"]):hover': { background: fillHover, color: vars.color.text } } },
		[reducedMotion]: { transition: "none" },
		[phone]: { flex: "1 1 auto", minHeight: 44, padding: "0 8px", fontSize: 15 },
		[tiny]: { padding: "0 6px", fontSize: 14 },
	},
});

export const tools = style({
	display: "flex",
	alignItems: "center",
	gap: 8,
	"@media": {
		[wide]: { marginLeft: "auto" },
		[phone]: { marginLeft: "auto" },
	},
});
globalStyle(`${tools} > a`, { textDecoration: "none" });