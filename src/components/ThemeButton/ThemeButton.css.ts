import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { phone } from "../../pages/LandingPage/LandingPage.css";
import { coarse, hover } from "../../styles/global.css";


export const themeBtn = style({
	width: 40,
	height: 40,
	display: "grid",
	placeItems: "center",
	flex: "none",
	background: `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`,
	border: 0,
	borderRadius: 999,
	color: vars.color.text,
	padding: 0,
	cursor: "pointer",
	"@media": {
		[hover]: {
			selectors: { "&:hover": { background: `color-mix(in srgb, ${vars.color.text} 10%, ${vars.color.background})` } },
		},
		[coarse]: { width: 44, height: 44 },
		// TODO: add other breakpoints
		[phone]: { marginLeft: "auto" }
	}
});
globalStyle(`${themeBtn} svg`, { width: 19, height: 19 })