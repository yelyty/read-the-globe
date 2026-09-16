import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { section } from "../../LandingPage.css";
import { vars } from "../../../theme.css";

export const atlasSvg = style({ display: "block", width: "100%", height: "auto" });
export const start = style([section, { paddingBottom: 90 }]);

export const startAtlas = style({
	position: "absolute",
	left: "50%",
	top: "56%",
	zIndex: -1,
	width: "min(1180px, 96%)",
	transform: "translate(-50%, -50%)",
});

export const startLand = style({
	fill: vars.color.mark,
	fillOpacity: 0.13,
	stroke: vars.color.border,
	strokeOpacity: 0.3,
	strokeWidth: 0.6,
	outline: "none",
});

export const pinSlot = style({
	fill: "none",
	stroke: vars.color.mark,
	strokeWidth: 1.6,
	strokeDasharray: "3 3",
	opacity: 0.5,
});

export const startGrid = style({
	position: "relative",
	maxWidth: 520,
	margin: "0 auto",
	textAlign: "center",
});

export const startTitle = style({
	fontSize: "clamp(38px, 4.5vw, 52px)",
	lineHeight: 1,
	textWrap: "balance",
});

export const startSub = style({
	margin: "20px auto 40px",
	fontSize: 19,
	fontWeight: 500,
	color: vars.color.textSecondary,
	textWrap: "pretty",
});

export const signupCard = style({
	position: "relative",
	textAlign: "left",
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: 10,
	padding: "34px 34px 36px",
	boxShadow: `0 18px 40px -24px rgba(${vars.shadow.ink}, .45)`,
});

export const fieldError = style({
	fontFamily: vars.font.sans,
	fontSize: 13,
	color: vars.color.error,
	margin: "7px 0 0 3px",
});

export const strength = style({
	display: "flex",
	alignItems: "center",
	gap: 10,
	marginTop: 10,
});

export const strengthBar = style({
	flex: 1,
	height: 6,
	borderRadius: 999,
	background: vars.color.backgroundDeep,
	overflow: "hidden",
});

export const note = {
	display: "flex",
	gap: 9,
	alignItems: "flex-start",
	fontFamily: vars.font.sans,
	fontSize: 14,
	lineHeight: 1.4,
	borderRadius: 6,
	padding: "11px 13px",
	marginBottom: 20,
} as const;

export const formError = style({
	...note,
	color: vars.color.error,
	background: vars.color.rustWash,
	border: `1px solid ${vars.color.markerAuthor}`,
});
globalStyle(`${formError} svg`, { width: 17, height: 17, flex: "none", marginTop: 1 });

export const formNotice = style({
	...note,
	fontWeight: 500,
	color: vars.color.oliveInk,
	background: vars.color.oliveWash,
});


const btn = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 10,
	fontFamily: vars.font.sans,
	fontWeight: 500,
	fontSize: 17,
	borderRadius: 999,
	padding: "17px 34px",
	textDecoration: "none",
	border: 0,
	cursor: "pointer",
	transition: "transform .14s, color .14s, background .14s",
	selectors: {
		"&:active": { transform: "translateY(0)" },
		"&[disabled]": { opacity: 0.72, cursor: "progress" },
	},
});
globalStyle(`${btn} svg`, { width: 17, height: 17, flex: "none" });


export const btnPrimary = style([
	btn,
	{
		color: vars.color.onAccent,
		background: vars.color.primary,
	},
]);

const strengthFillBase = style({
	height: "100%",
	width: "100%",
	transformOrigin: "left center",
	borderRadius: 999,
	transition: "transform .25s ease, background .25s ease",
});

export const strengthFill = styleVariants({
	0: [strengthFillBase, { background: vars.color.error }],
	1: [strengthFillBase, { background: vars.color.error }],
	2: [strengthFillBase, { background: vars.color.secondary }],
	3: [strengthFillBase, { background: vars.color.primary }],
	4: [strengthFillBase, { background: vars.color.primary }],
});

export const strengthLabel = style({
	fontFamily: vars.font.sans,
	fontSize: 13,
	color: vars.color.textSecondary,
	whiteSpace: "nowrap",
});

export const signupNote = style({
	marginTop: 12,
	textAlign: "center",
	fontFamily: vars.font.sans,
	fontSize: 14,
	color: vars.color.textMuted,
});

export const altAction = style({
	textAlign: "center",
	marginTop: 16,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textMuted,
});

export const altLink = style({
	background: "none",
	border: 0,
	padding: "11px 6px",
	margin: "-11px -6px",
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.text,
	textDecoration: "underline",
	textUnderlineOffset: 3,
	cursor: "pointer",
});

// TODO: do cleanup of buttons
export const btnBlock = style({
	width: "100%",
	fontSize: 16.5,
	padding: 17,
	marginTop: 6,
});
