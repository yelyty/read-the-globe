import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";
import { phone } from "../../LandingPage/LandingPage.css";


export const themeBtn = style({
	width: 40,
	height: 40,
	display: "grid",
	placeItems: "center",
	flex: "none",
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: 999,
	color: vars.color.textSecondary,
	padding: 0,
	cursor: "pointer",
	":hover": {
		color: vars.color.text,
	},
	"@media": {
		// TODO: add other breakpoints
		[phone]: { marginLeft: "auto" }
	}
});
globalStyle(`${themeBtn} svg`, { width: 19, height: 19 })