import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { coarse, hover, reducedMotion } from "../../styles/global.css";

const phone = "screen and (max-width: 639px)";
const band = `color-mix(in srgb, ${vars.color.text} 4%, ${vars.color.background})`;
const focus = { outline: `2px solid ${vars.color.accent}`, outlineOffset: 2 };

export const page = style({ paddingBlock: "32px 56px" });

export const viewHead = style({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "baseline",
	gap: "8px 16px",
	marginBottom: 24,
});
export const title = style({
	margin: 0,
	fontFamily: vars.font.display,
	fontWeight: 500,
	fontSize: 30,
	lineHeight: 1.1,
	color: vars.color.text,
	"@media": { [phone]: { fontSize: 26 } },
});


const fill = `color-mix(in srgb, ${vars.color.text} 6%, ${vars.color.background})`;
const fillHover = `color-mix(in srgb, ${vars.color.text} 10%, ${vars.color.background})`;

export const tabs = style({
	display: "flex",
	gap: 8,
	marginBottom: 24,
	borderBottom: `1px solid ${vars.color.border}`,
});


export const tab = style({
	display: "inline-flex",
	alignItems: "baseline",
	gap: 8,
	padding: "8px 24px",
	background: fill,
	border: "1px solid transparent",
	borderBottom: 0,
	borderRadius: "16px 16px 0 0",
	fontFamily: vars.font.sans,
	fontSize: 16,
	fontWeight: 500,
	color: vars.color.textSecondary,
	cursor: "pointer",
	selectors: {
		// it reaches 1px over the rule, so the open folder has no bottom edge
		'&[aria-selected="true"]': {
			marginBottom: -1,
			paddingBottom: 9,
			color: vars.color.text,
			background: vars.color.background,
			borderColor: vars.color.border,
		},
	},
	":focus-visible": { ...focus, borderRadius: "16px 16px 0 0" },
	"@media": {
		[hover]: { selectors: { "&:hover": { color: vars.color.text } } },
		[coarse]: { minHeight: 44 },
	},
});
export const tabN = style({
	fontSize: 13,
	fontWeight: 400,
	color: vars.color.textSecondary,
	fontVariantNumeric: "lining-nums tabular-nums",
});

export const toolbar = style({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: 12,
	marginBottom: 16,
});
export const search = style({ position: "relative", flex: "1 1 260px" });
globalStyle(`${search} svg`, {
	position: "absolute",
	left: 16,
	top: "50%",
	width: 16,
	height: 16,
	transform: "translateY(-50%)",
	color: vars.color.textMuted,
	pointerEvents: "none",
});
globalStyle(`${search} input`, {
	width: "100%",
	minHeight: 40,
	padding: "8px 16px 8px 40px",
	borderRadius: 999,
	background: vars.color.field,
	border: `1.5px solid ${vars.color.fieldLine}`,
	fontFamily: vars.font.sans,
	fontSize: 15,
	color: vars.color.text,
});
globalStyle(`${search} input:focus`, {
	borderColor: vars.color.primary,
	outline: "none",
});
globalStyle(`${search} input::-webkit-search-cancel-button`, {
	WebkitAppearance: "none",
	appearance: "none",
});

export const filters = style({
	display: "contents",
	"@media": {
		[phone]: {
			display: "none",
			selectors: {
				'&[data-open="true"]': {
					display: "flex",
					flexWrap: "wrap",
					flexBasis: "100%",
					gap: 12,
				},
			},
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
	selectors: {
		'&[aria-expanded="true"]': { background: vars.color.backgroundDeep },
	},
	":focus-visible": focus,
	"@media": { [phone]: { display: "inline-flex" } },
});
globalStyle(`${filterBtn} svg`, { width: 16, height: 16 });

// a dropdown: a filled pill with a chevron, no outline
export const pick = style({
	position: "relative",
	display: "inline-flex",
	alignItems: "center",
});
globalStyle(`${pick} svg`, {
	position: "absolute",
	right: 16,
	width: 12,
	height: 12,
	color: vars.color.textSecondary,
	pointerEvents: "none",
});
export const select = style({
	minHeight: 40,
	padding: "0 40px 0 16px",
	borderRadius: 999,
	border: 0,
	backgroundColor: fill,
	fontFamily: vars.font.sans,
	fontSize: 15,
	color: vars.color.textSecondary,
	appearance: "none",
	WebkitAppearance: "none",
	cursor: "pointer",
	":focus-visible": focus,
	"@media": {
		[hover]: { selectors: { "&:hover": { backgroundColor: fillHover } } },
		[coarse]: { minHeight: 44 },
	},
});

export const linkBtn = style({
	display: "inline-flex",
	alignItems: "center",
	gap: 8,
	padding: "8px 2px",
	background: "none",
	border: 0,
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textSecondary,
	textDecoration: "underline",
	textUnderlineOffset: 3,
	cursor: "pointer",
	":focus-visible": focus,
	"@media": {
		[hover]: { selectors: { "&:hover": { color: vars.color.text } } },
		[coarse]: { minHeight: 44 },
	},
});
globalStyle(`${linkBtn} svg`, { width: 16, height: 16, flex: "none" });

export const country = style({
	display: "grid",
	gridTemplateColumns: "184px minmax(0, 1fr)",
	gap: "8px 24px",
	alignItems: "center",
	margin: "8px 0 24px",
	"@media": { [phone]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});
// the same stamp as a country on Home's list: a 128 × 80 outline on the band, 16px in
export const countryMap = style({
	boxSizing: "border-box",
	width: 184,
	height: 112,
	padding: 16,
	borderRadius: 16,
	background: band,
});
globalStyle(`${countryMap} svg`, {
	display: "block",
	width: "100%",
	height: "100%",
});
// no outline: the fill (or the hatch, for both marks) is the country
export const shape = style({
	selectors: {
		'&[data-mark="set"]': { fill: vars.color.markerSetting },
		'&[data-mark="author"]': { fill: vars.color.markerAuthor },
		'&[data-mark="both"]': { fill: "url(#shelf-hatch)" },
	},
});
export const hatchSet = style({ fill: vars.color.markerSetting });
export const hatchAuthor = style({ fill: vars.color.markerAuthor });

export const countryName = style({
	margin: 0,
	fontFamily: vars.font.display,
	fontSize: 22,
	fontWeight: 500,
	lineHeight: 1.15,
	color: vars.color.text,
});
export const countryMeta = style({
	margin: "4px 0 0",
	fontSize: 13,
	color: vars.color.textMuted,
});
export const countryWhy = style({
	display: "flex",
	flexWrap: "wrap",
	gap: "4px 16px",
	margin: "8px 0 0",
	fontSize: 15,
	color: vars.color.textSecondary,
});
globalStyle(`${countryWhy} span`, {
	display: "inline-flex",
	alignItems: "center",
	gap: 8,
});
const dot = {
	display: "inline-block",
	width: 8,
	height: 8,
	borderRadius: "50%",
} as const;
export const dotSet = style({ ...dot, background: vars.color.markerSetting });
export const dotAuthor = style({ ...dot, background: vars.color.markerAuthor });
export const countryActions = style({
	display: "flex",
	flexWrap: "wrap",
	gap: "8px 24px",
	marginTop: 16,
});

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
globalStyle(`${yearHead} p`, {
	margin: "0 0 0 auto",
	fontSize: 13,
	color: vars.color.textMuted,
});
export const yearTitle = style({
	margin: 0,
	fontFamily: vars.font.display,
	fontSize: 22,
	fontWeight: 500,
	color: vars.color.text,
	fontVariantNumeric: "lining-nums",
});

export const yearToggle = style({
	display: "inline-flex",
	alignItems: "center",
	gap: 8,
	padding: 0,
	background: "none",
	border: 0,
	font: "inherit",
	color: "inherit",
	cursor: "pointer",
	":focus-visible": { ...focus, outlineOffset: 4, borderRadius: 8 },
	"@media": { [coarse]: { minHeight: 44 } },
});
globalStyle(`${yearToggle} svg`, {
	width: 16,
	height: 16,
	color: vars.color.textMuted,
	transition: "rotate .18s cubic-bezier(.2, .8, .25, 1)",
	"@media": { [reducedMotion]: { transition: "none" } },
});
// folded: the caret points at the year, as a closed row
globalStyle(`${yearToggle}[aria-expanded="false"] svg`, { rotate: "-90deg" });

/* ---------- empty states and more ---------- */
// one centred column under a sticker, as on Goals
export const emptyPanel = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	maxWidth: 560,
	marginInline: "auto",
	padding: "32px 0 40px",
	textAlign: "center",
});
globalStyle(`${emptyPanel} h2`, {
	margin: "0 0 8px",
	fontFamily: vars.font.display,
	fontSize: 22,
	fontWeight: 500,
	color: vars.color.text,
});
globalStyle(`${emptyPanel} p`, {
	margin: 0,
	maxWidth: "56ch",
	color: vars.color.textSecondary,
});

/* ---------- the stickers: a shelf with a gap (no books), a book with a ribbon (nothing saved) ---------- */
const deepRust = `color-mix(in srgb, ${vars.color.markerAuthor} 80%, black)`;
export const sticker = style({ width: 120, height: 100, marginBottom: 24 });
export const ssPlank = style({
	stroke: vars.color.textMuted,
	strokeWidth: 2.6,
});
const book = { strokeWidth: 2 } as const;
export const ssBookA = style({
	...book,
	fill: vars.color.primary,
	stroke: vars.color.oliveInk,
});
export const ssBookB = style({
	...book,
	fill: vars.color.backgroundDeep,
	stroke: vars.color.mark,
});
export const ssBookC = style({
	...book,
	fill: vars.color.markerAuthor,
	stroke: deepRust,
});
// a light band on the dark book, a deep one on the pale book, as on the landing's stack
export const ssBandA = style({ stroke: vars.color.onAccent, strokeWidth: 1.6 });
export const ssBandB = style({ stroke: vars.color.mark, strokeWidth: 1.6 });
// a space kept for the next book
export const ssGap = style({
	stroke: vars.color.textMuted,
	strokeWidth: 1.6,
	strokeDasharray: "3 3.5",
});
export const nsBook = style({
	fill: vars.color.backgroundDeep,
	stroke: vars.color.mark,
	strokeWidth: 2.2,
});
export const nsSpine = style({ stroke: vars.color.mark, strokeWidth: 1.6 });
export const nsRibbon = style({
	fill: vars.color.markerAuthor,
	stroke: deepRust,
	strokeWidth: 1.6,
});
export const nsRoad = style({
	stroke: vars.color.textMuted,
	strokeWidth: 1.8,
	strokeDasharray: "3.5 4",
});
// the pin still to be placed
export const nsPin = style({
	stroke: vars.color.textMuted,
	strokeWidth: 1.8,
	strokeDasharray: "3 3.5",
});
export const nsPinEye = style({
	stroke: vars.color.textMuted,
	strokeWidth: 1.6,
});

const button = {
	display: "inline-flex",
	alignItems: "center",
	gap: 8,
	minHeight: 40,
	padding: "8px 24px",
	borderRadius: 999,
	fontFamily: vars.font.sans,
	fontWeight: 500,
	fontSize: 15,
	textDecoration: "none",
	cursor: "pointer",
	":focus-visible": focus,
} as const;

export const primary = style({
	...button,
	marginTop: 16,
	border: 0,
	background: vars.color.primary,
	color: vars.color.onAccent,
	"@media": {
		[hover]: {
			selectors: { "&:hover": { background: vars.color.primaryHover } },
		},
	},
});
globalStyle(`${primary} svg`, { width: 16, height: 16 });

export const emptyNote = style({
	maxWidth: "60ch",
	margin: "4px 0 16px",
	color: vars.color.textSecondary,
});

export const moreBtn = style({
	...button,
	marginTop: 16,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	color: vars.color.text,
	"@media": {
		[hover]: {
			selectors: { "&:hover": { background: vars.color.backgroundDeep } },
		},
	},
});
globalStyle(`${moreBtn} svg`, { width: 16, height: 16 });

/* ---------- Next to read ---------- */
export const nextForm = style({
	display: "grid",
	gridTemplateColumns: "2fr 1.4fr 1.2fr",
	gap: "12px 12px",
	alignItems: "start",
	padding: 16,
	borderRadius: 16,
	background: band,
	"@media": { [phone]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});
export const nextWide = style({ gridColumn: "1 / -1" });

export const fieldLabel = style({
	display: "block",
	marginBottom: 8,
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textSecondary,
});
export const optional = style({ fontWeight: 400, color: vars.color.textMuted });
export const input = style({
	width: "100%",
	minHeight: 40,
	padding: "8px 16px",
	borderRadius: 12,
	background: vars.color.field,
	border: `1.5px solid ${vars.color.fieldLine}`,
	fontFamily: vars.font.sans,
	fontSize: 15,
	color: vars.color.text,
	"::placeholder": { color: vars.color.textMuted, opacity: 1 },
	":focus": { borderColor: vars.color.primary, outline: "none" },
	selectors: { '&[aria-invalid="true"]': { borderColor: vars.color.error } },
});
export const error = style({
	margin: 0,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.error,
});
export const formRow = style({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "12px 16px",
});
globalStyle(`${formRow} ${primary}`, { marginTop: 0 });
// a status, so not green: green is only for what the reader can press
export const status = style({
	margin: 0,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.oliveInk,
});

export const nextList = style({
	listStyle: "none",
	margin: "24px 0 0",
	padding: 0,
	borderTop: `1px solid ${vars.color.border}`,
});
export const nextItem = style({
	display: "grid",
	gridTemplateColumns: "88px minmax(0, 1fr) auto",
	alignItems: "start",
	gap: "8px 16px",
	padding: "12px 0",
	borderBottom: `1px solid ${vars.color.border}`,
	"@media": { [phone]: { gridTemplateColumns: "72px minmax(0, 1fr)" } },
});
export const nextStamp = style({
	display: "grid",
	placeItems: "center",
	width: 88,
	height: 56,
	borderRadius: 8,
	background: band,
	"@media": { [phone]: { width: 72, height: 48 } },
});
globalStyle(`${nextStamp} svg`, {
	width: 72,
	height: 45,
	"@media": { [phone]: { width: 60, height: 38 } },
});
// half strength: not on the atlas until it's read
export const nextShape = style({
	fillOpacity: 0.5,
	fill: vars.color.markerAuthor,
	selectors: { '&[data-mark="set"]': { fill: vars.color.markerSetting } },
});
// no country yet: a bookmark in its place
export const nextMark = style({ color: vars.color.textMuted });
globalStyle(`${nextStamp} svg${nextMark}`, { width: 20, height: 20 });

export const nextBody = style({ minWidth: 0, overflowWrap: "break-word" });
export const nextTitle = style({
	display: "block",
	fontFamily: vars.font.display,
	fontSize: 18,
	lineHeight: 1.2,
	color: vars.color.text,
});
export const nextAuthor = style({
	display: "block",
	fontSize: 15,
	color: vars.color.textSecondary,
});
export const nextMeta = style({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "4px 12px",
	marginTop: 4,
	fontSize: 13,
	color: vars.color.textSecondary,
});
globalStyle(`${nextMeta} > span`, {
	display: "inline-flex",
	alignItems: "center",
	gap: 8,
});
export const fresh = style({ color: vars.color.accent, fontWeight: 500 });
export const nextActs = style({
	display: "flex",
	gap: 16,
	"@media": { [phone]: { gridColumn: 2 } },
});
export const nextEmpty = style([emptyPanel, { paddingTop: 40 }]);
// a goal this book would move along
export const nextGoal = style({
	padding: "0 8px",
	borderRadius: 999,
	background: band,
	color: vars.color.textSecondary,
});
