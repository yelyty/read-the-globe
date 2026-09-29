import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

const phone = "screen and (max-width: 639px)";

export const plate = style({ position: "relative", margin: 0 });

// on phones the world keeps its size and scrolls sideways, as in the mock
export const scroll = style({
	"@media": {
		[phone]: {
			overflowX: "auto", overscrollBehaviorX: "contain", scrollbarWidth: "thin", scrollbarColor: `${vars.color.border} transparent`,
			marginInline: "calc(-1 * clamp(18px, 4vw, 40px))", paddingInline: "clamp(18px, 4vw, 40px)",
		},
	},
});

export const map = style({
	display: "block",
	width: "100%",
	height: "auto",
	"@media": { [phone]: { width: 596, maxWidth: "none" } },
});

export const land = style({
	fill: vars.color.backgroundDeep,
	fillOpacity: 0.55,
	stroke: vars.color.border,
	strokeWidth: 0.5,
	strokeLinejoin: "round",
	outline: "none",
	transition: "fill-opacity .18s ease, fill .18s ease",
});
export const set = style({});
export const author = style({});
export const marked = style({ cursor: "pointer" });

globalStyle(`${land}${set}`, { fill: vars.color.olive, fillOpacity: 0.92 });
globalStyle(`${land}${author}`, { fill: vars.color.markerAuthor, fillOpacity: 0.92 });
// both: set here, with the author's rust as its edge
globalStyle(`${land}${set}${author}`, { fill: vars.color.olive, stroke: vars.color.markerAuthor, strokeWidth: 1.6, vectorEffect: "non-scaling-stroke" });
globalStyle(`${land}${marked}:hover`, { fillOpacity: 1, stroke: vars.color.text, strokeWidth: 1 });

// Show: settings only / authors only
globalStyle(`${plate}[data-show="set"] ${land}${author}:not(${set}), ${plate}[data-show="author"] ${land}${set}:not(${author})`, {
	fill: vars.color.backgroundDeep, fillOpacity: 0.55, cursor: "default",
});
globalStyle(`${plate}[data-show="set"] ${land}${set}${author}`, { fill: vars.color.olive, stroke: vars.color.border, strokeWidth: 0.5 });
globalStyle(`${plate}[data-show="author"] ${land}${set}${author}`, { fill: vars.color.markerAuthor, stroke: vars.color.border, strokeWidth: 0.5 });

export const dots = style({ pointerEvents: "none" });
globalStyle(`${plate}[data-show="author"] ${dots}`, { display: "none" });
export const dot = style({ fill: vars.color.surface, stroke: vars.color.oliveInk, strokeWidth: 1.1 });

export const srOnly = style({
	position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap",
});
