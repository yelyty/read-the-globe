
import { globalStyle, style } from "@vanilla-extract/css";
import { hover, coarse, reducedMotion } from "../../../../styles/global.css";
import { vars } from "../../../../styles/theme.css";


const phone = "screen and (max-width: 639px)";
const band = `color-mix(in srgb, ${vars.color.text} 4%, ${vars.color.background})`;
const focus = { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2 };

export const page = style({ paddingBlock: "32px 56px" });

export const viewHead = style({ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 16px", marginBottom: 24 });
export const title = style({
	margin: 0, fontFamily: vars.font.display, fontWeight: 500, fontSize: 30, lineHeight: 1.1, color: vars.color.text,
	"@media": { [phone]: { fontSize: 26 } },
});
export const summary = style({ margin: 0, color: vars.color.textSecondary });

/* ---------- the toolbar ---------- */
export const toolbar = style({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 16 });
export const search = style({ position: "relative", flex: "1 1 260px" });
globalStyle(`${search} svg`, {
	position: "absolute", left: 16, top: "50%", width: 16, height: 16, transform: "translateY(-50%)", color: vars.color.textMuted, pointerEvents: "none",
});
globalStyle(`${search} input`, {
	width: "100%", minHeight: 40, padding: "8px 16px 8px 40px", borderRadius: 999,
	background: vars.color.field, border: `1.5px solid ${vars.color.fieldLine}`,
	fontFamily: vars.font.sans, fontSize: 15, color: vars.color.text,
});
globalStyle(`${search} input:focus`, { borderColor: vars.color.primary, outline: "none" });
globalStyle(`${search} input::-webkit-search-cancel-button`, { WebkitAppearance: "none", appearance: "none" });

// continent, set there or author from, year: in the search row, wrapping under it; on phones behind Filters
export const filters = style({
	display: "contents",
	"@media": {
		[phone]: {
			display: "none",
			selectors: { '&[data-open="true"]': { display: "flex", flexWrap: "wrap", flexBasis: "100%", gap: 12 } },
		},
	},
});

export const filterBtn = style({
	display: "none",
	alignItems: "center",
	gap: 8,
	minHeight: 40,
	padding: "8px 16px",
	border: `1px solid ${vars.color.border}`,
	borderRadius: 999,
	background: vars.color.surface,
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.text,
	cursor: "pointer",
	selectors: { '&[aria-expanded="true"]': { background: vars.color.backgroundDeep } },
	":focus-visible": focus,
	"@media": { [phone]: { display: "inline-flex" } },
});
globalStyle(`${filterBtn} svg`, { width: 16, height: 16 });

export const select = style({
	minHeight: 40, padding: "0 40px 0 16px", borderRadius: 999, border: `1.5px solid ${vars.color.fieldLine}`,
	backgroundColor: vars.color.field, fontFamily: vars.font.sans, fontSize: 15, color: vars.color.textSecondary,
	appearance: "none", WebkitAppearance: "none", cursor: "pointer",
	// the mock's little chevron, drawn with two gradients
	backgroundImage: `linear-gradient(45deg, transparent 50%, ${vars.color.textMuted} 50%), linear-gradient(135deg, ${vars.color.textMuted} 50%, transparent 50%)`,
	backgroundPosition: "calc(100% - 21px) 55%, calc(100% - 16px) 55%",
	backgroundSize: "5px 5px",
	backgroundRepeat: "no-repeat",
	":focus-visible": focus,
	"@media": { [hover]: { selectors: { "&:hover": { borderColor: vars.color.textMuted } } } },
});

export const linkBtn = style({
	display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 2px", background: "none", border: 0,
	fontFamily: vars.font.sans, fontSize: 15, fontWeight: 500, color: vars.color.textSecondary,
	textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer",
	":focus-visible": focus,
	"@media": { [hover]: { selectors: { "&:hover": { color: vars.color.text } } }, [coarse]: { minHeight: 44 } },
});
globalStyle(`${linkBtn} svg`, { width: 16, height: 16, flex: "none" });

/* ---------- the country page: ?country= from the map ---------- */
export const country = style({
	display: "grid",
	gridTemplateColumns: "184px minmax(0, 1fr)",
	gap: "8px 24px",
	alignItems: "center",
	margin: "8px 0 24px",
	"@media": { [phone]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});
// the same stamp as a country on Home's list: a 128 × 80 outline on the band, 16px in
export const countryMap = style({ boxSizing: "border-box", width: 184, height: 112, padding: 16, borderRadius: 16, background: band });
globalStyle(`${countryMap} svg`, { display: "block", width: "100%", height: "100%" });
export const shape = style({
	stroke: vars.color.text,
	strokeWidth: 0.75,
	vectorEffect: "non-scaling-stroke",
	selectors: {
		'&[data-mark="set"]': { fill: vars.color.markerSetting },
		'&[data-mark="author"]': { fill: vars.color.markerAuthor },
		'&[data-mark="both"]': { fill: "url(#shelf-hatch)" },
	},
});
export const hatchSet = style({ fill: vars.color.markerSetting });
export const hatchAuthor = style({ fill: vars.color.markerAuthor });

export const countryName = style({ margin: 0, fontFamily: vars.font.display, fontSize: 22, fontWeight: 500, lineHeight: 1.15, color: vars.color.text });
export const countryMeta = style({ margin: "4px 0 0", fontSize: 13, color: vars.color.textMuted });
export const countryWhy = style({ display: "flex", flexWrap: "wrap", gap: "4px 16px", margin: "8px 0 0", fontSize: 15, color: vars.color.textSecondary });
globalStyle(`${countryWhy} span`, { display: "inline-flex", alignItems: "center", gap: 8 });
const dot = { display: "inline-block", width: 8, height: 8, borderRadius: "50%" } as const;
export const dotSet = style({ ...dot, background: vars.color.markerSetting });
export const dotAuthor = style({ ...dot, background: vars.color.markerAuthor });
export const countryActions = style({ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginTop: 16 });

/* ---------- the list ---------- */
export const shelfList = style({ borderTop: `1px solid ${vars.color.border}` });

export const yearHead = style({
	listStyle: "none",
	display: "flex",
	flexWrap: "wrap",
	alignItems: "baseline",
	gap: "2px 16px",
	padding: "16px 0 8px",
	borderBottom: `1px solid ${vars.color.border}`,
});
// the year's count sits right, opposite the year
globalStyle(`${yearHead} p`, { margin: "0 0 0 auto", fontSize: 13, color: vars.color.textMuted });
export const yearTitle = style({
	margin: 0, fontFamily: vars.font.display, fontSize: 22, fontWeight: 500, color: vars.color.text, fontVariantNumeric: "lining-nums",
});

export const yearToggle = style({
	display: "inline-flex", alignItems: "center", gap: 8, padding: 0, background: "none", border: 0, font: "inherit", color: "inherit", cursor: "pointer",
	":focus-visible": { ...focus, outlineOffset: 4, borderRadius: 8 },
	"@media": { [coarse]: { minHeight: 44 } },
});
globalStyle(`${yearToggle} svg`, {
	width: 16, height: 16, color: vars.color.textMuted, transition: "rotate .18s cubic-bezier(.2, .8, .25, 1)",
	"@media": { [reducedMotion]: { transition: "none" } },
});
// folded: the caret points at the year, as a closed row
globalStyle(`${yearToggle}[aria-expanded="false"] svg`, { rotate: "-90deg" });

/* ---------- empty states and more ---------- */
export const emptyPanel = style({ padding: "24px 0", borderTop: `1px solid ${vars.color.border}`, borderBottom: `1px solid ${vars.color.border}` });
globalStyle(`${emptyPanel} h2`, { margin: 0, fontFamily: vars.font.display, fontSize: 22, fontWeight: 500, color: vars.color.text });
globalStyle(`${emptyPanel} p`, { margin: "4px 0 0", maxWidth: "56ch", color: vars.color.textSecondary });

const button = {
	display: "inline-flex", alignItems: "center", gap: 8, minHeight: 40, padding: "8px 24px", borderRadius: 999,
	fontFamily: vars.font.sans, fontWeight: 500, fontSize: 15, textDecoration: "none", cursor: "pointer",
	":focus-visible": focus,
} as const;

export const primary = style({
	...button,
	marginTop: 16,
	border: 0,
	background: vars.color.primary,
	color: vars.color.onAccent,
	"@media": { [hover]: { selectors: { "&:hover": { background: vars.color.primaryHover } } } },
});
globalStyle(`${primary} svg`, { width: 16, height: 16 });

export const emptyNote = style({ maxWidth: "60ch", margin: "4px 0 16px", color: vars.color.textSecondary });

export const moreBtn = style({
	...button,
	marginTop: 16,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	color: vars.color.text,
	"@media": { [hover]: { selectors: { "&:hover": { background: vars.color.backgroundDeep } } } },
});
globalStyle(`${moreBtn} svg`, { width: 16, height: 16 });