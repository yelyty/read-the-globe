import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { hover, reducedMotion } from "../../styles/global.css";
import { navLink } from "../AppHeader/AppHeader.css";

const phone = "screen and (max-width: 639px)";

export const menu = style({
	position: "relative",
	"@media": { [phone]: { flex: "1 1 auto" } },
});


export const button = style([
	navLink,
	{
		gap: 4,
		selectors: {
			'&[aria-expanded="true"]': { color: vars.color.text },
			"&[data-current]": { background: vars.color.background, color: vars.color.text },
		},
		"@media": { [phone]: { width: "100%" } },
	},
]);

export const caret = style({
	width: 12,
	height: 12,
	transition: "rotate .2s cubic-bezier(.23, 1, .32, 1)",
	selectors: { [`${button}[aria-expanded="true"] &`]: { rotate: "180deg" } },
	"@media": { [reducedMotion]: { transition: "none" } },
});

const listIn = keyframes({ from: { opacity: 0, transform: "scale(.97)" } });
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
	borderRadius: 16,
	transformOrigin: "top right",
	animation: `${listIn} .15s cubic-bezier(.23, 1, .32, 1)`,
	selectors: { "&[hidden]": { display: "none" } },
	"@media": { [reducedMotion]: { animation: "none" } },
});
globalStyle(`${list} li + li`, {
	marginTop: 4,
	paddingTop: 4,
	borderTop: `1px solid ${vars.color.border}`,
});

export const item = style({
	display: "flex",
	alignItems: "center",
	width: "100%",
	minHeight: 40,
	padding: "0 12px",
	border: 0,
	borderRadius: 8,
	background: "none",
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textSecondary,
	textDecoration: "none",
	textAlign: "left",
	cursor: "pointer",
	":focus-visible": { background: vars.color.primary, color: vars.color.onAccent, outline: "none" },
	"@media": {
		[hover]: { selectors: { "&:hover": { background: vars.color.primary, color: vars.color.onAccent } } },
	},
});