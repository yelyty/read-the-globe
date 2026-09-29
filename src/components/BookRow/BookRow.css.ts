// One book as a row: cover, title and author; where it is set and where its author is from; the date.
// Shared by Home (Recent pins) and the Shelf. Values from the app mock's .book-row.
import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

const phone = "screen and (max-width: 639px)";

export const srOnly = style({
	position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap",
});

export const list = style({ listStyle: "none", margin: 0, padding: 0 });
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
