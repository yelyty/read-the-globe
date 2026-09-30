import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { coarse, hover, phone } from "../../styles/global.css";
import { wrap } from "../../pages/LandingPage/LandingPage.css";

const pillFloats = "screen and (max-width: 899px)";

export const footer = style({
	marginTop: "auto",
	borderTop: `1px solid ${vars.color.stroke}`,
	fontFamily: vars.font.sans,
	fontSize: 13.5,
	color: vars.color.textMuted,
});

export const row = style([
	wrap,
	{
		display: "flex",
		flexWrap: "wrap",
		alignItems: "baseline",
		gap: "6px 26px",
		paddingBlock: "18px 22px",
		"@media": {
			[pillFloats]: { paddingBottom: 88 },
		},
	},
]);

export const links = style({ display: "flex", flexWrap: "wrap", gap: "4px 18px" });

export const link = style({
	color: vars.color.textSecondary,
	textDecoration: "none",
	"@media": {
		[hover]: {
			selectors: {
				"&:hover": { color: vars.color.text, textDecoration: "underline", textUnderlineOffset: 3 },
			},
		},
		[coarse]: { display: "inline-flex", alignItems: "center", minHeight: 44 },
		[phone]: { display: "inline-flex", alignItems: "center", minHeight: 44, minWidth: 44, justifyContent: "center" },
	},
	selectors: {
		"&:focus-visible": { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2, borderRadius: 3 },
	},
});

export const credit = style({
	marginLeft: "auto",
	"@media": { [pillFloats]: { marginLeft: 0 } },
});