import { globalStyle, keyframes, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../../theme.css";
import { coarse, phone, tablet, tiny } from "../../../global.css";
import { wrap } from "../../LandingPage.css";
import { label } from "../Goals/Goals.css";
import { btnPrimary } from "../LoginDialog/LoginDialog.css";

const c = vars.color;
const f = vars.font;
const ease = "cubic-bezier(.2, .8, .25, 1)";

export const story = style([
	wrap,
	{
		position: "relative",
		paddingTop: 72,
		scrollMarginTop: 72,
		"@media": { [phone]: { paddingTop: 44 } },
	},
]);

export const pin = style({ position: "relative" });

export const exampleTag = style({ right: 24 });

export const frame = style({
	position: "relative",
	overflow: "hidden",
	border: `1px solid ${c.border}`,
	borderRadius: 8,
	background: c.field,
	boxShadow: `inset 0 0 0 5px ${c.surface}, inset 0 0 0 6px rgba(160, 126, 58, 0.5)`,
	height: ["min(74vh, 640px)", "min(74svh, 640px)"],
	"@media": {
		[tablet]: { height: 780 },
		[phone]: { height: ["min(760px, calc(100vh - 96px))", "min(760px, calc(100svh - 96px))"] },
	},
});

export const stage = style({ position: "absolute", inset: 0 });

export const map = style({
	position: "absolute",
	inset: 0,
	display: "block",
	width: "100%",
	height: "100%",
});

export const world = style({
	transformBox: "view-box",
	transformOrigin: "0 0",
	transition: "transform 1.2s cubic-bezier(.65, 0, .35, 1)",
	selectors: { "&:not([data-ready])": { transition: "none" } },
});

export const land = style({
	fill: vars.map.land,
	stroke: c.border,
	strokeWidth: 0.6,
	vectorEffect: "non-scaling-stroke",
	outline: "none",
});


const markBase = style({
	stroke: c.border,
	strokeWidth: 1,
	vectorEffect: "non-scaling-stroke",
	outline: "none",
	fillOpacity: 0,
	transition: `fill-opacity .6s ${ease}`,
});

export const mark = styleVariants({
	set: [markBase, { fill: c.markerSetting }],
	author: [markBase, { fill: c.markerAuthor }],
	both: [markBase, { fill: "url(#story-both-hatch)" }],
});

const landEdge = keyframes({ "0%, 40%": { stroke: c.secondary, strokeWidth: "3px" } });
const landEdgeAgain = keyframes({ "0%, 40%": { stroke: c.secondary, strokeWidth: "3px" } });

export const landed = style({
	fillOpacity: 0.92,
	transitionDelay: ".7s",
	animation: `${landEdge} 1.1s ${ease} .7s backwards`,
});

export const landedAgain = style({
	fillOpacity: 0.92,
	transitionDelay: ".7s",
	animation: `${landEdgeAgain} 1.1s ${ease} .7s backwards`,
});

export const hatchSet = style({ fill: c.markerSetting });
export const hatchAuthor = style({ fill: c.markerAuthor });

export const legend = style({
	position: "absolute",
	right: 22,
	top: 24,
	display: "flex",
	flexWrap: "wrap",
	gap: "6px 18px",
	fontFamily: f.sans,
	fontSize: 13,
	color: c.textSecondary,
	background: c.field,
	border: `1px solid ${c.border}`,
	borderRadius: 999,
	padding: "7px 14px",
	"@media": {
		[phone]: {
			display: "none",
			selectors: {
				[`${story}[data-copy="4"] &`]: {
					display: "flex",
					top: 88,
					left: 14,
					right: "auto",
					fontSize: 12,
					gap: "4px 10px",
					padding: "5px 10px",
				},
			},
		},
	},
});
globalStyle(`${legend} > span`, { display: "inline-flex", alignItems: "center", gap: 7 });

export const count = style({
	position: "absolute",
	right: 22,
	bottom: 20,
	display: "flex",
	flexWrap: "wrap",
	alignItems: "baseline",
	gap: "0 8px",
	background: c.field,
	borderRadius: 8,
	padding: "10px 16px 9px",
	boxShadow: `inset 0 0 0 4px ${c.background}, inset 0 0 0 5px ${c.border}`,
	"@media": {
		[phone]: { left: 14, right: "auto", top: 14, bottom: "auto", padding: "7px 11px 6px" },
	},
});

export const countNum = style({
	display: "inline-block",
	fontFamily: f.display,
	fontWeight: 400,
	fontSize: 40,
	lineHeight: 1,
	letterSpacing: "-.01em",
	color: c.text,
	transition: `color .45s ease, translate .45s ${ease}`,
	selectors: { '&[data-ticking="true"]': { color: c.secondary, translate: "0 -3px" } },
	"@media": { [phone]: { fontSize: 28 } },
});

export const countOf = style({ fontFamily: f.sans, fontSize: 15, color: c.textMuted });

export const countLabel = style([label, { flexBasis: "100%", marginTop: 2 }]);

export const panel = style({
	position: "absolute",
	left: 26,
	top: "50%",
	translate: "0 -50%",
	width: "min(400px, 40%)",
	display: "flex",
	flexDirection: "column",
	gap: 14,
	background: c.surface,
	border: `1px solid ${c.border}`,
	borderRadius: 10,
	padding: "20px 20px 18px",
	boxShadow: `0 10px 30px -18px rgba(${vars.shadow.ink}, .35)`,
	selectors: {
		[`${story}[data-copy="4"] &`]: {
			top: "auto",
			bottom: 20,
			translate: "none",
			width: "min(560px, calc(100% - 52px))",
		},
	},
	"@media": {
		[tablet]: {
			left: 14,
			right: 14,
			width: "auto",
			top: "auto",
			bottom: 14,
			translate: "none",
			selectors: { [`${story}[data-copy="4"] &`]: { width: "auto", bottom: 14 } },
		},
		[phone]: { padding: "16px 14px 14px", gap: 12 },
	},
});

export const controls = style({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "10px 14px",
});

export const play = style([btnPrimary, { fontSize: 15, padding: "10px 20px" }]);

export const stepButtons = style({ display: "flex", gap: 6 });

export const stepButton = style({
	width: 38,
	height: 38,
	display: "grid",
	placeItems: "center",
	padding: 0,
	borderRadius: 999,
	border: `1px solid ${c.border}`,
	background: c.surface,
	color: c.textSecondary,
	fontFamily: f.display,
	fontSize: 17,
	fontVariantNumeric: "lining-nums",
	cursor: "pointer",
	transition: "background .14s, color .14s, border-color .14s",
	selectors: {
		"&:hover": { background: c.backgroundDeep, color: c.text },
		'&[aria-pressed="true"]': { background: c.primary, borderColor: c.primary, color: c.onAccent },
	},
	"@media": { [coarse]: { width: 44, height: 44 } },
});

export const steps = style({
	position: "relative",
	listStyle: "none",
	margin: 0,
	padding: 0,
	display: "grid",
});

export const step = style({
	gridArea: "1 / 1",
	alignSelf: "end",
	translate: "0 8px",
	opacity: 0,
	visibility: "hidden",
	transition: "opacity .2s ease, translate .2s ease, visibility 0s linear .2s",
	selectors: {
		'&[data-active="true"]': {
			opacity: 1,
			visibility: "visible",
			translate: "0 0",
			transition: `opacity .35s ease .2s, translate .5s ${ease} .2s, visibility 0s linear .2s`,
		},
		'&[data-last="true"][data-active="false"]': { position: "absolute", insetInline: 0, bottom: 0 },
	},
});

export const stepTitle = style({
	display: "flex",
	alignItems: "baseline",
	gap: 12,
	fontSize: "clamp(24px, 2.2vw, 30px)",
	lineHeight: 1.05,
	textWrap: "balance",
	"@media": { [phone]: { fontSize: 24 } },
});

export const stepN = style({
	flex: "none",
	fontWeight: 400,
	fontSize: ".7em",
	color: c.textMuted,
	transition: "color .3s ease",
	selectors: { '&[data-current="true"]': { color: c.text } },
});

export const stepText = style({
	marginTop: 8,
	fontSize: 16,
	fontWeight: 500,
	color: c.textSecondary,
	textWrap: "pretty",
});

export const books = style({
	marginTop: 8,
	fontFamily: f.display,
	fontStyle: "italic",
	fontSize: 14.5,
	lineHeight: 1.45,
	color: c.textSecondary,
	textWrap: "pretty",
});

/* the form is a picture of the app's form: filled in by the demo, never focusable */
export const form = style({
	display: "grid",
	gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
	gap: "10px 12px",
	transition: "opacity .2s ease",
	selectors: {
		[`${story}[data-copy="4"] &`]: { display: "none" },
		/* at rest it reads as a picture: faded, with a dashed Pin; a click plays the demo */
		'&[data-resting="true"]': { opacity: 0.62, cursor: "pointer" },
		'&[data-resting="true"]:hover': { opacity: 0.85 },
	},
});

export const field = style({
	display: "flex",
	flexDirection: "column",
	gap: 5,
	minWidth: 0,
	"@media": { [tiny]: { gridColumn: "1 / -1" } },
});

export const fieldWide = style({ gridColumn: "1 / -1" });

export const fieldLabel = style({
	display: "inline-flex",
	alignItems: "center",
	gap: 6,
	fontFamily: f.sans,
	fontSize: 12,
	letterSpacing: "1.4px",
	textTransform: "uppercase",
	color: c.textMuted,
});

const caret = keyframes({ "50%": { opacity: 0 } });

export const input = style({
	position: "relative",
	display: "flex",
	alignItems: "center",
	minHeight: 38,
	padding: "6px 11px",
	background: c.field,
	border: `1.5px solid ${c.fieldLine}`,
	borderRadius: 6,
	fontFamily: f.sans,
	fontSize: 15,
	fontWeight: 500,
	color: c.text,
	whiteSpace: "nowrap",
	overflow: "hidden",
	transition: "border-color .15s, box-shadow .15s",
	selectors: {
		"&:empty::before": { content: "attr(data-placeholder)", color: c.textMuted, fontWeight: 400 },
		'&[data-typing="true"]': { borderColor: c.primary, boxShadow: "0 0 0 3px rgba(74, 106, 64, 0.18)" },
		'&[data-typing="true"]::after': {
			content: '""',
			width: 1.5,
			height: "1.05em",
			marginLeft: 1,
			background: c.primary,
			animation: `${caret} 1s steps(1) infinite`,
		},
		'[data-lit="true"] &': { borderColor: c.markerAuthor, boxShadow: "0 0 0 3px rgba(139, 58, 51, 0.16)" },
	},
});

export const placeRow = style({
	display: "grid",
	gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
	gap: 8,
	"@media": { [tiny]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});

export const pinButton = style({
	gridColumn: "1 / -1",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 8,
	minHeight: 40,
	borderRadius: 999,
	background: c.primary,
	border: "1.5px solid transparent",
	color: c.onAccent,
	fontFamily: f.sans,
	fontSize: 15,
	fontWeight: 500,
	transition: "background .12s, translate .12s",
	selectors: {
		'&[data-pressed="true"]': { background: c.primaryHover, translate: "0 1px" },
		'[data-resting="true"] &': { background: "none", borderColor: c.fieldLine, borderStyle: "dashed", color: c.textMuted },
	},
});
globalStyle(`${pinButton} svg`, { width: 15, height: 15 });


export const atlasSvg = style({ display: "block", width: "100%", height: "auto" });

const dotBase = style({
	display: "inline-block",
	width: 9,
	height: 9,
	borderRadius: "50%",
	flex: "none",
});

export const swatch = style({
	display: "inline-block",
	width: 10,
	height: 10,
	borderRadius: 2,
	flex: "none",
	background: `repeating-linear-gradient(45deg, ${c.markerSetting} 0 2px, ${c.markerAuthor} 2px 4px)`,
});

export const srOnly = style({
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	padding: 0,
	overflow: "hidden",
	clipPath: "inset(50%)",
	whiteSpace: "nowrap",
	border: 0,
});

export const dot = styleVariants({
	set: [dotBase, { background: c.markerSetting }],
	author: [dotBase, { boxShadow: `inset 0 0 0 2.5px ${c.markerAuthor}` }],
});
