import { style } from "@vanilla-extract/css";
import { wrap } from "../../LandingPage.css";
import { vars } from "../../../theme.css";

export const hero = style([
	wrap,
	{
		position: "relative",
		paddingTop: 52,
	},
]);

export const heroCopy = style({
	position: "relative",
	overflow: "hidden",
	paddingBottom: 12,
	marginBottom: -12,
});


export const heroTitle = style({
	fontSize: "clamp(48px, 6vw, 88px)",
	lineHeight: 0.95,
	textWrap: "balance",
});

export const heroSub = style({
	margin: "26px auto 0",
	fontSize: 20,
	fontWeight: 500,
	color: vars.color.textSecondary,
	maxWidth: 520,
	textWrap: "pretty",
});

export const heroInner = style({
	position: "relative",
	zIndex: 2,
	maxWidth: 760,
	margin: "0 auto",
	textAlign: "center",
	paddingTop: 34,
});
export const heroCta = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: 12,
	marginTop: 34,
});
