import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { coarse, hover, phone, reducedMotion } from "../../styles/global.css";

const band = `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`;
const focus = { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2 };
const ease = "cubic-bezier(.23, 1, .32, 1)";
const rise = keyframes({ from: { opacity: 0, translate: "0 8px", scale: ".98" } });
const sheetUp = keyframes({ from: { translate: "0 100%" } });
const fade = keyframes({ from: { opacity: 0 } });

export const srOnly = style({
	position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap",
});

export const sheet = style({
	width: "min(560px, 100vw - 48px)",
	maxHeight: "calc(100dvh - 48px)",
	margin: "auto",
	padding: 24,
	overflow: "auto",
	overscrollBehavior: "contain",
	background: vars.color.surface,
	color: vars.color.text,
	border: `1px solid ${vars.color.border}`,
	borderRadius: 16,
	selectors: {
		"&[open]": { animation: `${rise} .22s ${ease}` },
		"&::backdrop": { background: `rgba(${vars.shadow.ink}, .35)` },
		'&[data-editing="true"]': { borderColor: vars.color.secondary, boxShadow: "0 0 0 3px rgba(199, 165, 54, .22)" },
	},
	"@media": {
		[phone]: {
			width: "100%",
			maxWidth: "100%",
			maxHeight: "92dvh",
			margin: "auto 0 0",
			padding: "24px 24px 0",
			borderRadius: "16px 16px 0 0",
			borderBottom: 0,
			selectors: { "&[open]": { animation: `${sheetUp} .26s ${ease}` } },
		},
		[reducedMotion]: { selectors: { "&[open]": { animation: `${fade} .2s ease-out` } } },
	},
});

export const head = style({ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 });
export const title = style({ margin: 0, fontFamily: vars.font.display, fontSize: 26, fontWeight: 500, lineHeight: 1.15 });
export const editing = style({
	margin: "2px 0 0", fontFamily: vars.font.display, fontSize: 18, lineHeight: 1.2,
	display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
});
export const sub = style({ margin: "4px 0 0", color: vars.color.textSecondary });

export const close = style({
	display: "grid", placeItems: "center", flex: "none", width: 40, height: 40, margin: "-8px -8px 0 0", padding: 0,
	border: 0, borderRadius: "50%", background: "none", color: vars.color.textSecondary, cursor: "pointer",
	":focus-visible": focus,
	selectors: { "&[hidden]": { visibility: "hidden", display: "grid" } },
	"@media": { [hover]: { selectors: { "&:hover": { background: band, color: vars.color.text } } } },
});
globalStyle(`${close} svg`, { width: 18, height: 18 });

/* ---------- Will mark ---------- */
export const preview = style({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 16px", margin: "-8px 0 16px", fontSize: 14, color: vars.color.textSecondary });
export const label = style({ fontSize: 12, fontWeight: 500, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted });
export const mark = style({ display: "inline-flex", alignItems: "center", gap: 8 });
const dot = { display: "inline-block", flex: "none", width: 9, height: 9, borderRadius: "50%", marginRight: 8, verticalAlign: "0.05em" } as const;
export const dotSet = style({ ...dot, background: vars.color.olive });
export const dotAuthor = style({ ...dot, boxShadow: `inset 0 0 0 2.5px ${vars.color.markerAuthor}` });
// both marks: the map's olive and rust hatch
export const swatch = style({
	...dot, borderRadius: 2,
	background: `repeating-linear-gradient(45deg, ${vars.color.olive} 0 2px, ${vars.color.markerAuthor} 2px 4px)`,
});
globalStyle(`${mark} i`, { marginRight: 0 });

export const hint = style({ margin: "8px 0 0", fontSize: 15, lineHeight: 1.4, color: vars.color.textSecondary });

/* ---------- places ---------- */
export const set = style({ minWidth: 0, margin: "0 0 16px", padding: 0, border: 0 });
globalStyle(`${set} > legend`, { padding: 0 });
globalStyle(`${set} > legend + ${hint}`, { margin: "0 0 8px" });
const placeGrid = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 40px", gap: 8, alignItems: "start" } as const;
export const placesHead = style({
	...placeGrid, marginBottom: 8, fontSize: 12, fontWeight: 500, letterSpacing: 1.4, textTransform: "uppercase", color: vars.color.textMuted,
	"@media": { [phone]: { display: "none" } },
});
export const places = style({ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 });
export const place = style({
	...placeGrid,
	"@media": { [phone]: { gridTemplateColumns: "minmax(0, 1fr) 40px", paddingBottom: 8, borderBottom: `1px solid ${vars.color.border}` } },
});
// phones: name above country, the remove button beside both
globalStyle(`${place} > button`, { alignSelf: "center", margin: 0, "@media": { [phone]: { gridColumn: 2, gridRow: "1 / span 2" } } });
globalStyle(`${place} > div`, { "@media": { [phone]: { gridColumn: 1 } } });

export const month = style({ display: "flex", gap: 8, maxWidth: 400 });
globalStyle(`${month} select:first-of-type`, { flex: "1.4 1 0" });
globalStyle(`${month} select:last-of-type`, { flex: "1 1 0" });

export const themes = style({ margin: "0 0 16px", padding: 0, border: 0 });
globalStyle(`${themes} summary`, { cursor: "pointer", fontWeight: 500, color: vars.color.textSecondary });
globalStyle(`${themes} ul`, { listStyle: "none", margin: "8px 0 0 16px", padding: 0, display: "flex", flexDirection: "column", gap: 4 });
globalStyle(`${themes} label`, { display: "flex", alignItems: "center", gap: 8, minHeight: 32, cursor: "pointer" });

export const formError = style({
	margin: "16px 0 0", padding: "8px 16px", borderRadius: 8, background: vars.color.rustWash, color: vars.color.error,
	fontSize: 15, fontWeight: 500, lineHeight: 1.4,
});

/* ---------- actions ---------- */
export const actions = style({
	display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: "16px 24px", marginTop: 16,
	"@media": {
		// on the sheet, Pin it stays at the bottom while the form scrolls
		[phone]: {
			position: "sticky", bottom: 0, margin: "16px -24px 0", padding: "16px 24px",
			background: vars.color.surface, borderTop: `1px solid ${vars.color.border}`,
			flexWrap: "nowrap",
		},
	},
});

export const linkBtn = style({
	display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 2px", background: "none", border: 0,
	fontFamily: vars.font.sans, fontSize: 16, fontWeight: 500, color: vars.color.textSecondary, cursor: "pointer",
	":focus-visible": focus,
	":disabled": { opacity: 0.6, cursor: "not-allowed" },
	"@media": { [hover]: { selectors: { "&:hover": { color: vars.color.text } } }, [coarse]: { minHeight: 44 } },
});
globalStyle(`${linkBtn} svg`, { width: 16, height: 16, flex: "none" });

export const danger = style({ marginRight: "auto", color: vars.color.error });

export const primary = style({
	display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, padding: "8px 32px",
	border: 0, borderRadius: 999, background: vars.color.primary, color: vars.color.onAccent,
	fontFamily: vars.font.sans, fontSize: 17, fontWeight: 500, cursor: "pointer",
	transition: `scale .16s ${ease}, background-color .16s ${ease}`,
	":focus-visible": focus,
	":active": { scale: ".97" },
	":disabled": { cursor: "progress", opacity: 0.8 },
	"@media": {
		[hover]: { selectors: { "&:hover:not(:disabled)": { background: vars.color.primaryHover } } },
		[phone]: { flex: 1 },
		[reducedMotion]: { transition: "none" },
	},
});
globalStyle(`${primary} svg`, { width: 18, height: 18 });
