import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../../theme.css";
import { phone, sectionHead } from "../../LandingPage.css";

export const ease = "cubic-bezier(.2, .8, .25, 1)";

export const reveal = style({
	transition: `opacity 0.7s ${ease}, translate 0.7s ${ease}`,
	selectors: {
		'&[data-revealed="false"]': {
			opacity: 0,
			translate: "0 18px"
		}
	}
})


export const goalsHead = style([sectionHead, { marginBottom: 28 }]);

export const h2Small = style({
	fontSize: "clamp(34px, 4.5vw, 46px)",
	lineHeight: 1.02,
	textWrap: "balance"
});

export const goalsLede = style({
	marginTop: 14,
	fontSize: 17.5,
	fontWeight: 500,
	color: vars.color.textSecondary,
});

export const goalsList = style({
	maxWidth: 760,
	marginTop: "0 auto",
	listStyle: "none",
	borderTop: `1px solid ${vars.color.border}`,
	padding: 0
});

export const label = style({
	fontFamily: vars.font.sans,
	fontSize: 12,
	letterSpacing: "1.6px",
	textTransform: "uppercase",
	color: vars.color.textMuted,
});

export const goal = style({
	display: "grid",
	gridTemplateColumns: "minmax(0, 1fr) 96px",
	gap: 24,
	alignItems: "baseline",
	padding: "16px 4px 14px",
	borderBottom: `1px solid ${vars.color.border}`,
	"@media": {
		[phone]: {
			gridTemplateColumns: "minmax(0, 1fr) auto", gap: 16
		}
	}
});

export const goalKind = style([
	label,
	{ marginBottom: 5, letterSpacing: "1.8px" }
]);


export const goalName = style({
	fontFamily: vars.font.display,
	fontSize: 24,
	lineHeight: 1.1
});

export const goalCount = style({
	fontFamily: vars.font.display,
	fontSize: 14,
	color: vars.color.textMuted,
	textAlign: "right",
	whiteSpace: "nowrap"
});
globalStyle(`${goalCount} b`, {
	fontWeight: 400,
	fontSize: 26,
	color: vars.color.text
});

export const route = style({
	vars: { "--route": vars.color.markerSetting },
	gridColumn: "1 / -1",
	position: "relative",
	marginTop: 14,
	height: 24,
});

export const routeTrack = style({
	position: "absolute",
	left: 0,
	right: 16,
	top: "50%",
	borderTop: `3px dashed ${vars.color.border}`
});

export const routeFill = style({
	position: "absolute",
	left: 0,
	right: 16,
	top: "50%",
	marginTop: -2,
	height: 7,
	borderRadius: 99,
	background: "var(--route)",
	transform: "scaleX(0)",
	transformOrigin: 'left center',
	transition: "transform 1.4s cubic-bezier(.5, 0, .3, 1) .2s",
	selectors: {
		'[data-revealed="true"] &': { transform: "scaleX(var(--p))" }
	}
});

export const routePin = style({
	position: "absolute",
	left: "calc(var(--p) * (100% - 16px))",
	top: "50%",
	width: 23,
	height: 23,
	transform: "translate(-50%, -72%)",
})

export const routeFlag = style({
	position: "absolute",
	right: 0,
	top: "50%",
	width: 15,
	height: 20,
	transform: "translateY(-84%)",
})