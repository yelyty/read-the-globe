
import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

const phone = "screen and (max-width: 639px)";

export const page = style({ paddingBlock: "28px 56px" });

export const srOnly = style({
	position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap",
});

export const firstRun = style({ marginBottom: 18 });
export const title = style({
	margin: 0, fontFamily: vars.font.display, fontWeight: 500, fontSize: 30, lineHeight: 1.1, color: vars.color.text, textWrap: "balance",
	"@media": { [phone]: { fontSize: 26 } },
});
globalStyle(`${firstRun} p`, { margin: "12px 0 0", maxWidth: "56ch", fontSize: 16, color: vars.color.textSecondary });
export const primary = style({
	display: "inline-flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 22px", borderRadius: 999,
	background: vars.color.primary, color: vars.color.onAccent, fontFamily: vars.font.sans, fontWeight: 500, fontSize: 15,
	textDecoration: "none", ":hover": { background: vars.color.primaryHover },
});
globalStyle(`${primary} svg`, { width: 16, height: 16 });

/* ---------- the cartouche: over the empty South Pacific on wide screens, a strip under the map on phones ---------- */
export const cartouche = style({
	position: "absolute", left: 14, bottom: 14, zIndex: 2, minWidth: 168, padding: "12px 18px",
	background: vars.color.surface, borderRadius: 6,
	boxShadow: `inset 0 0 0 4px ${vars.color.surface}, inset 0 0 0 5px ${vars.color.border}, 0 6px 16px -10px rgba(${vars.shadow.ink}, .35)`,
	"@media": { [phone]: { position: "static", marginTop: 10, display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", columnGap: 12 } },
});
export const cartTitle = style({
	margin: 0, fontFamily: vars.font.serif, fontStyle: "italic", fontSize: 17, lineHeight: 1.2, color: vars.color.textSecondary,
	"@media": { [phone]: { gridColumn: "1 / -1" } },
});
export const cartBig = style({ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0 6px", margin: "4px 0 0" });
globalStyle(`${cartBig} b`, {
	fontFamily: vars.font.serif, fontWeight: 400, fontSize: 44, lineHeight: 0.95, letterSpacing: "-.01em", color: vars.color.text,
	fontVariantNumeric: "lining-nums tabular-nums",
});
globalStyle(`${cartBig} span`, { fontSize: 14, color: vars.color.textMuted });
export const cartCap = style({
	flexBasis: "100%", marginTop: 2, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase",
	"@media": { [phone]: { flexBasis: "auto", marginLeft: 6 } },
});
globalStyle(`${cartBig} ${cartCap}`, { fontSize: 12 });
export const cartMeta = style({
	margin: "6px 0 0", paddingTop: 6, borderTop: `1px solid ${vars.color.border}`, fontSize: 13, color: vars.color.textSecondary,
	"@media": { [phone]: { borderTop: 0, paddingTop: 0, margin: 0 } },
});

/* ---------- the key and the Show filter ---------- */
export const legend = style({
	display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 6,
	paddingTop: 8, fontSize: 13, color: vars.color.textSecondary,
});
export const key = style({ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "6px 18px" });
globalStyle(`${key} li`, { display: "inline-flex", alignItems: "center", gap: 7 });
const swatch = { width: 11, height: 11, borderRadius: 2, flex: "none" } as const;
export const swatchSet = style({ ...swatch, background: vars.color.olive });
export const swatchAuthor = style({ ...swatch, background: vars.color.markerAuthor });
export const swatchBoth = style({ ...swatch, background: vars.color.olive, boxShadow: `inset 0 0 0 2px ${vars.color.markerAuthor}` });
export const showGroup = style({ display: "inline-flex", alignItems: "center", gap: 2 });
export const capsLabel = style({ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted, marginRight: 6 });
export const showBtn = style({
	display: "inline-flex", alignItems: "center", minHeight: 32, padding: "4px 11px", borderRadius: 999,
	border: "1px solid transparent", background: "none", fontFamily: vars.font.sans, fontSize: 13, color: vars.color.textSecondary, cursor: "pointer",
	":hover": { background: vars.color.backgroundDeep, color: vars.color.text },
	selectors: { '&[aria-pressed="true"]': { background: vars.color.surface, borderColor: vars.color.border, color: vars.color.text } },
});

/* ---------- sections: recent pins, countries ---------- */
export const section = style({ marginTop: 28 });
export const subHead = style({
	display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "6px 16px",
	paddingBottom: 12, borderBottom: `1px solid ${vars.color.border}`,
});
export const h2 = style({ margin: 0, fontFamily: vars.font.display, fontWeight: 500, fontSize: 22, color: vars.color.text });
export const more = style({
	display: "inline-flex", alignItems: "center", gap: 6, minHeight: 24, fontWeight: 500, color: vars.color.textSecondary, textDecoration: "none",
	":hover": { color: vars.color.text, textDecoration: "underline" },
});
globalStyle(`${more} svg`, { width: 15, height: 15 });
export const subNote = style({ margin: 0, fontSize: 14, color: vars.color.textMuted });

export const rows = style({ listStyle: "none", margin: 0, padding: 0 });
export const row = style({
	display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.4fr) auto", gap: "6px 20px", alignItems: "start",
	padding: "12px 0", borderBottom: `1px solid ${vars.color.border}`,
	"@media": { [phone]: { gridTemplateColumns: "minmax(0, 1fr)", gap: 10 } },
});
export const rowMain = style({ minWidth: 0 });
export const cover = style({
	float: "left", width: 44, height: 62, margin: "0 14px 4px 0", borderRadius: 3,
	boxShadow: `inset -3px 0 4px rgba(0, 0, 0, .18), 0 1px 2px rgba(${vars.shadow.ink}, .25)`,
	"::before": { content: '""', display: "block", width: 3, height: "100%", marginLeft: 5, background: "rgba(255, 255, 255, .14)" },
});
export const rowTitle = style({ display: "block", fontFamily: vars.font.display, fontSize: 18, lineHeight: 1.15, color: vars.color.text });
export const rowAuthor = style({ display: "block", marginTop: 2, fontSize: 14, color: vars.color.textSecondary });
export const rowMarks = style({
	display: "flex", flexDirection: "column", gap: 4, minWidth: 0, paddingTop: 2, fontSize: 14, color: vars.color.textSecondary,
	"@media": { [phone]: { clear: "both" } },
});
export const mark = style({ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0, overflowWrap: "anywhere" });
const dot = { flex: "none", width: 9, height: 9, borderRadius: "50%", alignSelf: "center" } as const;
export const dotSet = style({ ...dot, background: vars.color.olive });
export const dotAuthor = style({ ...dot, boxShadow: `inset 0 0 0 2.5px ${vars.color.markerAuthor}` });
export const markCountry = style({ fontStyle: "normal", color: vars.color.textMuted });
export const markNone = style({ fontStyle: "italic", color: vars.color.textMuted });
export const rowSide = style({
	display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, whiteSpace: "nowrap",
	fontSize: 13, color: vars.color.textMuted, fontVariantNumeric: "tabular-nums",
	"@media": { [phone]: { flexDirection: "row", alignItems: "baseline", gap: 18 } },
});

export const cc = style({ display: "block", paddingTop: 4, borderBottom: `1px solid ${vars.color.border}` });
export const ccSummary = style({
	display: "flex", alignItems: "center", gap: 10, minHeight: 40, cursor: "pointer", listStyle: "none",
	"::before": {
		content: '""', width: 7, height: 7, borderRight: `1.5px solid ${vars.color.textMuted}`, borderBottom: `1.5px solid ${vars.color.textMuted}`,
		rotate: "-45deg", transition: "rotate .18s ease",
	},
});
globalStyle(`${cc}[open] ${ccSummary}::before`, { rotate: "45deg" });
globalStyle(`${ccSummary}::-webkit-details-marker`, { display: "none" });
export const ccTitle = style({
	margin: 0, fontFamily: vars.font.sans, fontSize: 12, fontWeight: 500, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted,
	selectors: { [`${ccSummary}:hover &`]: { color: vars.color.text } },
});
globalStyle(`${ccTitle} span[aria-hidden]`, { marginLeft: 6, letterSpacing: 0, color: vars.color.textSecondary });
export const ccList = style({ listStyle: "none", margin: 0, padding: "2px 0 12px 18px", display: "flex", flexWrap: "wrap", gap: 6 });
const chip = style({
	display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 11px 4px 8px", borderRadius: 999,
	background: vars.color.surface, border: `1px solid ${vars.color.border}`, fontFamily: vars.font.sans, fontSize: 13,
	color: vars.color.text, textDecoration: "none", ":hover": { background: vars.color.backgroundDeep },
	"::before": { content: '""', width: 8, height: 8, borderRadius: "50%" },
});
export const ccSet = style([chip, { "::before": { background: vars.color.olive } }]);
export const ccAuthor = style([chip, { "::before": { boxShadow: `inset 0 0 0 2px ${vars.color.markerAuthor}` } }]);
export const ccBoth = style([chip, { "::before": { borderRadius: 2, background: vars.color.olive, boxShadow: `inset 0 0 0 2px ${vars.color.markerAuthor}` } }]);
