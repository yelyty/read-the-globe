// The Shelf, as in the app mock (app.html / app.css): heading and summary, the search toolbar,
// year headings, and the empty states. Rows come from components/BookRow.
import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

const phone = "screen and (max-width: 639px)";

export const page = style({ paddingBlock: "28px 56px" });

export const viewHead = style({ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 18px", marginBottom: 18 });
export const title = style({
	margin: 0, fontFamily: vars.font.display, fontWeight: 500, fontSize: 30, lineHeight: 1.1, color: vars.color.text,
	"@media": { [phone]: { fontSize: 26 } },
});
export const summary = style({ margin: 0, color: vars.color.textSecondary });

export const toolbar = style({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 14 });
export const search = style({ position: "relative", flex: "1 1 260px" });
globalStyle(`${search} svg`, {
	position: "absolute", left: 12, top: "50%", width: 16, height: 16, transform: "translateY(-50%)", color: vars.color.textMuted, pointerEvents: "none",
});
globalStyle(`${search} input`, {
	width: "100%", minHeight: 40, padding: "8px 14px 8px 36px", borderRadius: 999,
	background: vars.color.field, border: `1.5px solid ${vars.color.fieldLine}`,
	fontFamily: vars.font.sans, fontSize: 15, color: vars.color.text,
});
globalStyle(`${search} input:focus`, { borderColor: vars.color.primary, boxShadow: "0 0 0 3px rgba(74, 106, 64, 0.18)", outline: "none" });
globalStyle(`${search} input::-webkit-search-cancel-button`, { WebkitAppearance: "none", appearance: "none" });

export const select = style({
	minHeight: 40, padding: "0 30px 0 14px", borderRadius: 999, border: `1.5px solid ${vars.color.fieldLine}`,
	backgroundColor: vars.color.surface, fontFamily: vars.font.sans, fontSize: 14, color: vars.color.textSecondary,
	appearance: "none", WebkitAppearance: "none", cursor: "pointer",
	// the mock's little chevron, drawn with two gradients
	backgroundImage: `linear-gradient(45deg, transparent 50%, ${vars.color.textMuted} 50%), linear-gradient(135deg, ${vars.color.textMuted} 50%, transparent 50%)`,
	backgroundPosition: "calc(100% - 16px) 55%, calc(100% - 11px) 55%",
	backgroundSize: "5px 5px",
	backgroundRepeat: "no-repeat",
});

export const linkBtn = style({
	display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 2px", background: "none", border: 0,
	fontFamily: vars.font.sans, fontSize: 14, fontWeight: 500, color: vars.color.textSecondary,
	textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer",
	":hover": { color: vars.color.text },
});

export const shelfList = style({ borderTop: `1px solid ${vars.color.border}` });
export const yearHead = style({ listStyle: "none", padding: "18px 0 6px", borderBottom: `1px solid ${vars.color.border}` });
globalStyle(`${yearHead} h2`, {
	margin: 0, fontFamily: vars.font.sans, fontSize: 12, fontWeight: 500, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted,
});

export const emptyPanel = style({ padding: "22px 0", borderTop: `1px solid ${vars.color.border}`, borderBottom: `1px solid ${vars.color.border}` });
globalStyle(`${emptyPanel} h2`, { margin: 0, fontFamily: vars.font.display, fontSize: 22, fontWeight: 500, color: vars.color.text });
globalStyle(`${emptyPanel} p`, { margin: "4px 0 0", maxWidth: "56ch", color: vars.color.textSecondary });
export const primary = style({
	display: "inline-flex", alignItems: "center", gap: 10, marginTop: 14, padding: "12px 22px", borderRadius: 999,
	background: vars.color.primary, color: vars.color.onAccent, fontFamily: vars.font.sans, fontWeight: 500, fontSize: 15,
	textDecoration: "none", ":hover": { background: vars.color.primaryHover },
});
globalStyle(`${primary} svg`, { width: 16, height: 16 });

export const emptyNote = style({ maxWidth: "60ch", margin: "4px 0 18px", color: vars.color.textSecondary });
export const moreBtn = style({
	marginTop: 18, padding: "12px 22px", borderRadius: 999, border: `1px solid ${vars.color.border}`,
	background: vars.color.surface, fontFamily: vars.font.sans, fontSize: 15, fontWeight: 500, color: vars.color.text, cursor: "pointer",
	":hover": { background: vars.color.backgroundDeep },
});
