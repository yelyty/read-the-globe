import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../../theme.css";
import { phone, wrap } from "../../LandingPage.css";

export const header = style({
	position: "sticky",
	top: 0,
	zIndex: 60,
	background: vars.color.background,
	backdropFilter: "blur(8px)",
	WebkitBackdropFilter: "blur(8px)",
	"@media": {
		"(prefers-reduced-transparency: reduce)": {
			background: vars.color.background,
			backdropFilter: "none",
			WebkitBackdropFilter: "none",
		},
	},
});

export const headerRow = style([
	wrap,
	{
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "12px 22px",
		paddingBlock: 14,
		"@media": { [phone]: { gap: 8, flexWrap: "nowrap" } },
	},
]);

export const logoLink = style({
	display: "flex",
	flex: "none",
	alignItems: "center",
	gap: 8,
	marginRight: "auto",
	textDecoration: "none",
	color: vars.color.text
});

export const logo = style({
	display: "block",
	flex: "none",
	width: 40,
	height: 40,
});


export const logoTitle = style({
	fontFamily: vars.font.display,
	color: vars.color.text,
	fontSize: "1.35rem",
	fontWeight: 700,
	letterSpacing: "-0.01em",
});

export const nav = style({
	display: "flex",
	alignItems: "center",
	gap: 22,
	marginLeft: "auto",
	"@media": {
		[phone]: { display: "none" },
	},
});

const navText = {
	display: "inline-flex",
	alignItems: "center",
	minHeight: 40,
	padding: "6px 4px",
	margin: "-6px -4px",
	fontFamily: vars.font.sans,
	fontSize: 15.5,
	fontWeight: 500,
	textDecoration: "none",
	whiteSpace: "nowrap",
	background: "none",
	border: 0,
	borderRadius: 6,
	cursor: "pointer",
} as const;

export const navLink = style({
	...navText,
	color: vars.color.textSecondary,
	":hover": { color: vars.color.textSecondary },
});

export const loginBtn = style({
	...navText,
	color: vars.color.text,
	"@media": {
		[phone]: { fontSize: 14 },
	},
});

export const pill = style({
	display: "inline-flex",
	alignItems: "center",
	gap: 9,
	fontFamily: vars.font.sans,
	fontWeight: 500,
	fontSize: 15,
	color: vars.color.onAccent,
	background: vars.color.primary,
	borderRadius: 999,
	padding: "11px 22px",
	minHeight: 40,
	textDecoration: "none",
	transition: "transform .14s, background .14s",
	"@media": {
		[phone]: { padding: "10px 14px", fontSize: 14 },
	},
});
globalStyle(`${pill} svg`, { width: 14, height: 14 });

// export const pillLabel = style({
// 	"@media": {
// 		[tiny]: {
// 			position: "absolute",
// 			width: 1,
// 			height: 1,
// 			overflow: "hidden",
// 			clipPath: "inset(50%)",
// 			whiteSpace: "nowrap",
// 		},
// 	},
// });
// globalStyle(`${pill}:hover svg`, {
// 	"@media": { [hover]: { color: c.secondaryBright } },
// });