// Home, as in the latest app mock (app.html / app.css): the title, the plate with its cartouche, key and
// full screen button, Recent reads (rows from components/BookRow), and the countries as stamps.
import { globalStyle, style } from "@vanilla-extract/css";
import { fontSize, space, vars } from "../../styles/theme.css";
import { coarse, hover, phone } from "../../styles/global.css";

const focusRing = { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2 };
// the page's own tint for flat panels (cartouche, stamps): no borders, no shadows
const band = `color-mix(in srgb, ${vars.color.secondary} 11%, ${vars.color.background})`;
const fill = `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`;
const fillOn = `color-mix(in srgb, ${vars.color.text} 14%, ${vars.color.background})`;

export const page = style({ paddingBlock: `${space.sp6} 56px` });

export const srOnly = style({
	position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap",
});

/* ---------- the title: left over the map; centred while the atlas is blank ---------- */
export const viewHead = style({
	display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: `${space.sp1} ${space.sp4}`,
	marginBottom: space.sp5,
	selectors: { "&[data-blank]": { justifyContent: "center", textAlign: "center" } },
});
export const title = style({
	display: "inline-flex", alignItems: "center", gap: space.sp4, margin: 0,
	fontFamily: vars.font.display, fontWeight: 500, fontSize: "clamp(30px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.01em",
	color: vars.color.text, textWrap: "balance",
});
export const titleIcon = style({ flex: "none", width: "1em", height: "1em", color: vars.color.textSecondary });

export const firstRun = style({ margin: `calc(${space.sp2} * -1) 0 ${space.sp5}`, textAlign: "center" });
globalStyle(`${firstRun} p`, { margin: "0 auto", maxWidth: "56ch", fontSize: fontSize.action, color: vars.color.textSecondary });

/* ---------- the plate, and its full screen ---------- */
export const plate = style({
	position: "relative",
	selectors: {
		"&[data-full]": {
			position: "fixed", inset: 0, zIndex: 85, display: "flex", flexDirection: "column", justifyContent: "center", gap: space.sp3,
			padding: space.sp6, background: vars.color.background, overflow: "auto", overscrollBehavior: "contain",
		},
	},
	"@media": { [phone]: { selectors: { "&[data-full]": { padding: `${space.sp6} ${space.sp3} ${space.sp3}` } } } },
});
// anywhere but a marked country (which opens the Shelf) opens the full screen map
globalStyle(`${plate}:not([data-full]) .rsm-svg`, { cursor: "zoom-in" });
// above the map's top edge, level with the page title, so it never covers land
export const fullBtn = style({
	position: "absolute", bottom: "calc(100% + 8px)", right: 0, zIndex: 3, display: "grid", placeItems: "center",
	width: 40, height: 40, padding: 0, border: 0, borderRadius: "50%", background: fill, color: vars.color.textSecondary, cursor: "pointer",
	":focus-visible": focusRing,
	"@media": { [hover]: { selectors: { "&:hover": { background: fillOn, color: vars.color.text } } } },
	selectors: { [`${plate}[data-full] &`]: { position: "fixed", top: space.sp3, bottom: "auto", right: space.sp3 } },
});
globalStyle(`${fullBtn} svg`, { width: 16, height: 16 });

/* ---------- the cartouche: over the empty South Pacific on wide screens, a strip under the map on phones ---------- */
export const cartouche = style({
	position: "absolute", left: 14, bottom: 14, zIndex: 2, minWidth: 168, padding: `${space.sp2} ${space.sp4}`,
	background: band, borderRadius: 8,
	border: "1px solid transparent", // the frame forced-colours mode keeps
	"@media": {
		[phone]: { position: "static", margin: "8px 0 2px", display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 8px" },
	},
});
export const cartBig = style({ display: "flex", alignItems: "baseline", gap: space.sp2, margin: 0 });
globalStyle(`${cartBig} b`, {
	fontFamily: vars.font.serif, fontWeight: 400, fontSize: fontSize.numeral, lineHeight: 0.95, letterSpacing: "-.01em", color: vars.color.text,
	fontVariantNumeric: "lining-nums tabular-nums",
});
export const cartOf = style({
	position: "relative", fontSize: fontSize.body, color: vars.color.textMuted, cursor: "help",
	textDecoration: "underline dotted 1px", textUnderlineOffset: 3, borderRadius: 4,
	":focus-visible": focusRing,
});
export const cartWhy = style({
	position: "absolute", left: 0, bottom: "calc(100% + 8px)", zIndex: 5, width: "min(320px, calc(100vw - 48px))",
	padding: `${space.sp2} ${space.sp3}`, borderRadius: 8, background: vars.color.text, color: vars.color.background,
	fontFamily: vars.font.sans, fontSize: fontSize.meta, lineHeight: 1.45, textDecoration: "none", textWrap: "pretty",
	opacity: 0, visibility: "hidden", transition: "opacity .12s ease-out, visibility 0s linear .12s",
	selectors: { [`${cartOf}:is(:hover, :focus) &`]: { opacity: 1, visibility: "visible", transition: "opacity .12s ease-out, visibility 0s" } },
});
export const cartCap = style({
	margin: "2px 0 0", fontSize: fontSize.label, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted,
});
export const cartMeta = style({
	margin: `${space.sp2} 0 0`, paddingTop: space.sp2, borderTop: `1px solid ${vars.color.border}`,
	fontSize: fontSize.meta, color: vars.color.textSecondary, fontVariantNumeric: "lining-nums tabular-nums",
	"@media": { [phone]: { borderTop: 0, paddingTop: 0, margin: "0 0 0 auto" } },
});

/* ---------- the key and the Show filter ---------- */
export const legend = style({
	display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: space.sp2,
	paddingTop: space.sp2, fontSize: fontSize.meta, color: vars.color.textSecondary,
});
export const key = style({ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 16px" });
globalStyle(`${key} li`, { display: "inline-flex", alignItems: "center", gap: 8 });
const swatch = { width: 11, height: 11, borderRadius: 2, flex: "none" } as const;
export const swatchSet = style({ ...swatch, background: vars.color.olive });
export const swatchAuthor = style({ ...swatch, background: vars.color.markerAuthor });
// the key draws what the map draws: both is the hatch
export const swatchBoth = style({
	...swatch,
	background: `repeating-linear-gradient(45deg, ${vars.color.olive} 0 2px, ${vars.color.markerAuthor} 2px 4px)`,
});
export const showGroup = style({ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: space.sp2 });
export const capsLabel = style({ fontSize: fontSize.label, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted, marginRight: 8 });
// pills: a flat fill, no bolder weight when picked, so picking never shifts the neighbours
export const showBtn = style({
	display: "inline-flex", alignItems: "center", minHeight: 40, padding: `${space.sp2} ${space.sp4}`, borderRadius: 999,
	border: "1px solid transparent", background: fill, fontFamily: vars.font.sans, fontSize: fontSize.body, fontWeight: 500,
	color: vars.color.textSecondary, cursor: "pointer",
	":focus-visible": focusRing,
	"@media": {
		[hover]: { selectors: { "&:hover": { background: fillOn } } },
		[coarse]: { minHeight: 44 },
		"(forced-colors: active)": { borderColor: "ButtonText" },
	},
	selectors: { '&[aria-pressed="true"]': { background: `color-mix(in srgb, ${vars.color.secondary} 22%, ${vars.color.background})`, color: vars.color.text } },
});

/* ---------- sections: recent reads, countries ---------- */
export const section = style({ marginTop: space.sp6 });
export const subHead = style({
	display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: `${space.sp2} ${space.sp4}`,
	margin: `0 0 ${space.sp3}`,
});
export const h2 = style({
	display: "inline-flex", alignItems: "baseline", gap: 8, margin: 0,
	fontFamily: vars.font.display, fontWeight: 500, fontSize: fontSize.heading, color: vars.color.text,
});
// the words set the row's baseline, so the link beside them shares it; the glyph centres on them
export const h2Icon = style({ alignSelf: "center", flex: "none", width: 22, height: 22, color: vars.color.textSecondary });
export const more = style({
	display: "inline-flex", alignItems: "center", gap: 8, minHeight: 40, fontWeight: 500, color: vars.color.textSecondary, textDecoration: "none",
	":focus-visible": focusRing,
	"@media": {
		[hover]: { selectors: { "&:hover": { color: vars.color.text, textDecoration: "underline" } } },
		[coarse]: { minHeight: 44 },
	},
});
globalStyle(`${more} svg`, { width: 15, height: 15 });
export const subNote = style({ margin: 0, fontSize: fontSize.body, color: vars.color.textMuted, textWrap: "pretty" });

/* ---------- countries: a folded row per continent, a stamp per country ---------- */
export const cc = style({ display: "flex", flexDirection: "column", borderBottom: `1px solid ${vars.color.border}` });
export const ccRow = style({ display: "block", borderTop: `1px solid ${vars.color.border}` });
export const ccSummary = style({
	display: "flex", alignItems: "center", gap: space.sp3, minHeight: 72, padding: "8px 0", cursor: "pointer", listStyle: "none",
	":focus-visible": { ...focusRing, borderRadius: 8 },
	"::before": {
		content: '""', flex: "none", width: 8, height: 8, margin: "0 4px",
		borderRight: `1.5px solid ${vars.color.textSecondary}`, borderBottom: `1.5px solid ${vars.color.textSecondary}`,
		rotate: "-45deg", transition: "rotate .18s cubic-bezier(.2, .8, .25, 1)",
	},
	"@media": { "(prefers-reduced-motion: reduce)": { "::before": { transition: "none" } } },
});
globalStyle(`${ccRow}[open] > ${ccSummary}::before`, { rotate: "45deg" });
globalStyle(`${ccSummary}::-webkit-details-marker`, { display: "none" });
export const ccTitle = style({
	display: "flex", alignItems: "baseline", gap: 12, margin: 0,
	fontFamily: vars.font.serif, fontWeight: 500, fontSize: fontSize.heading, lineHeight: 1.15, color: vars.color.text,
});
export const ccN = style({
	fontFamily: vars.font.serif, fontWeight: 400, fontSize: fontSize.item, color: vars.color.textMuted,
	fontVariantNumeric: "lining-nums tabular-nums", whiteSpace: "nowrap",
});
export const ccPeek = style({ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" });
globalStyle(`${ccRow}[open] ${ccPeek}`, { display: "none" });
// phones: three outlines are enough of a hint
globalStyle(`${ccPeek} svg:nth-child(n+4)`, { "@media": { [phone]: { display: "none" } } });
export const ccMore = style({
	fontSize: fontSize.meta, color: vars.color.textMuted, fontVariantNumeric: "tabular-nums",
	"@media": { [phone]: { display: "none" } },
});

export const ccStamps = style({
	listStyle: "none", margin: 0, padding: `0 0 ${space.sp4}`, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(184px, 1fr))", gap: 16,
	"@media": { [phone]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 } },
});
export const ccStamp = style({
	display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", height: "100%", padding: 16,
	borderRadius: 16, background: band, color: vars.color.text, textAlign: "left", textDecoration: "none", fontFamily: vars.font.sans,
	":focus-visible": focusRing,
	"@media": {
		[hover]: {
			transition: "background-color .15s ease-out",
			selectors: { "&:hover": { background: `color-mix(in srgb, ${vars.color.secondary} 18%, ${vars.color.background})` } },
		},
		[phone]: { padding: "16px 8px" },
	},
});
export const ccShape = style({
	display: "grid", placeItems: "center", width: "100%", height: 80, marginBottom: 16,
	"@media": { [phone]: { height: 70 } },
});
globalStyle(`${ccShape} svg`, { "@media": { [phone]: { width: 112, height: 70 } } });
export const ccName = style({ fontFamily: vars.font.serif, fontWeight: 500, fontSize: fontSize.item, lineHeight: 1.2, overflowWrap: "break-word" });
export const ccWhat = style({ marginTop: 4, fontSize: fontSize.meta, color: vars.color.textSecondary });
// the stamp's country wears its mark from the map, with no outline
export const shapeSet = style({ fill: vars.color.olive });
export const shapeAuthor = style({ fill: vars.color.markerAuthor });

export const primary = style({
	// the app mock's .btn: body size, 40px tall like the fields beside it, no hero buttons
	display: "inline-flex", alignItems: "center", gap: 10, marginTop: space.sp4, minHeight: 40, padding: `${space.sp2} ${space.sp5}`, borderRadius: 999,
	background: vars.color.primary, color: vars.color.onAccent, fontFamily: vars.font.sans, fontWeight: 500, fontSize: fontSize.body,
	textDecoration: "none", ":hover": { background: vars.color.primaryHover },
});
globalStyle(`${primary} svg`, { width: 16, height: 16 });