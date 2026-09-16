import { style, styleVariants, keyframes, globalStyle } from "@vanilla-extract/css";
import { vars } from "../theme.css";
import { reducedMotion } from "../global.css";

/* Derived semi-transparent tint of the primary color. */
const primarySoft = `color-mix(in srgb, ${vars.color.primary} 12%, transparent)`;

export const phone = "screen and (max-width: 639px)";



export const page = style({
	minHeight: "100vh",
	background: vars.color.background,
	color: vars.color.text,
	fontFamily: vars.font.serif,
	fontSize: 17,
	lineHeight: 1.5,
	overflowX: "clip",
	caretColor: vars.color.primary,
	fontVariantNumeric: "tabular-nums",
})

/* :where() keeps these at one class of specificity, so component classes win. */
globalStyle(`${page} :where(h1, h2, h3)`, {
	margin: 0,
	fontFamily: vars.font.display,
	fontWeight: 500,
});
globalStyle(`${page} :where(p)`, { margin: 0 });
globalStyle(`${page} :where(a)`, {
	color: vars.color.text,
	textUnderlineOffset: 3,
});
globalStyle(`${page} :where(button, input)`, {
	font: "inherit",
	color: "inherit",
});
globalStyle(`${page} :where(a, button, input, [tabindex]):focus-visible`, {
	outline: `2px solid ${vars.color.accent}`,
	outlineOffset: 2,
});
globalStyle(`${page} ::selection`, { background: "rgba(74, 106, 64, 0.25)" });
globalStyle(`${page} *, ${page} *::before, ${page} *::after`, {
	"@media": {
		[reducedMotion]: {
			transitionDuration: "0s !important",
			animationDuration: "0s !important",
			animationDelay: "0s !important",
		},
	},
});
globalStyle("body:has(dialog[open])", { overflow: "hidden" });

export const wrap = style({
	maxWidth: 1240,
	marginInline: "auto",
	paddingInline: "clamp(18px, 4vw, 40px)"
})

export const section = style([
	wrap,
	{
		position: "relative",
		isolation: "isolate",
		paddingTop: 96,
		scrollMarginTop: 72,
		"@media": { [phone]: { paddingTop: 72 } },
	},
]);

export const sectionHead = style({
	textAlign: "center",
	maxWidth: 680,
	margin: "0 auto",
});



export const heroMap = style({
	display: "flex",
	justifyContent: "center",  // horizontal center of the map within this column
	alignItems: "center",      // vertical center against the text column
	flex: 1,                   // let it take its share of the row
})


export const mapWrapper = style({
	width: "100%",
	maxWidth: 800,             // cap so centering is visible
	margin: "0 auto",
});

/* ================================================================== *
 * Signup card
 * ================================================================== */
export const signupCard = style({
	position: "relative",
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: 16,
	padding: "2.25rem",
	boxShadow: `0 18px 50px ${vars.color.overlay}`,
	"::before": {
		content: '""',
		position: "absolute",
		insetInline: 0,
		top: 0,
		height: 9,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
});

export const stamp = style({
	position: "absolute",
	top: -18,
	right: 26,
	width: 52,
	height: 60,
	transform: "rotate(9deg)",
	background: vars.color.surface,
	border: `2px dashed ${vars.color.border}`,
	borderRadius: 4,
	display: "grid",
	placeItems: "center",
	color: vars.color.markerAuthor,
	boxShadow: `0 6px 16px ${vars.color.overlay}`,
});

export const cardTitle = style({
	margin: "0.5rem 0 0.3rem",
	fontFamily: vars.font.display,
	fontSize: "1.7rem",
	fontWeight: 700,
	color: vars.color.text,
});

export const cardSub = style({
	margin: "0 0 1.6rem",
	fontStyle: "italic",
	color: vars.color.textMuted,
	fontSize: "0.98rem",
});

export const field = style({ marginBottom: "1.1rem" });

export const fieldLabel = style({
	display: "block",
	fontSize: "0.68rem",
	fontWeight: 700,
	letterSpacing: "0.11em",
	textTransform: "uppercase",
	color: vars.color.textMuted,
	marginBottom: "0.45rem",
});

export const inputRow = style({ position: "relative" });

export const input = style({
	width: "100%",
	boxSizing: "border-box",
	background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.md,
	padding: "0.8rem 1rem",
	fontFamily: vars.font.serif,
	fontSize: "1rem",
	color: vars.color.text,
	outline: "none",
	transition: "border-color 150ms ease, box-shadow 150ms ease",
	"::placeholder": { color: vars.color.textDisabled },
	":focus": {
		borderColor: vars.color.primary,
		boxShadow: `0 0 0 3px ${primarySoft}`,
	},
});

export const showBtn = style({
	position: "absolute",
	right: 12,
	top: "50%",
	transform: "translateY(-50%)",
	background: "none",
	border: "none",
	cursor: "pointer",
	fontFamily: vars.font.serif,
	fontSize: "0.9rem",
	color: vars.color.textMuted,
	":hover": { color: vars.color.text },
});

export const createBtn = style({
	width: "100%",
	marginTop: "0.5rem",
	padding: "0.9rem",
	borderRadius: vars.radius.md,
	border: "none",
	background: vars.color.primary,
	color: vars.color.onAccent,
	fontFamily: vars.font.serif,
	fontSize: "1.05rem",
	fontWeight: 600,
	cursor: "pointer",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "0.5rem",
	boxShadow: `0 6px 16px color-mix(in srgb, ${vars.color.primary} 30%, transparent)`,
	transition: "background 150ms ease, transform 120ms ease",
	":hover": { background: vars.color.primaryHover },
	":active": { transform: "translateY(1px)" },
});

export const cardFoot = style({
	marginTop: "1.1rem",
	textAlign: "center",
	fontSize: "0.95rem",
	color: vars.color.textMuted,
});

export const cardFootLink = style({
	color: vars.color.text,
	fontWeight: 600,
	textDecoration: "underline",
	textUnderlineOffset: 3,
	cursor: "pointer",
});


/* ================================================================== *
 * How it works — step cards
 * ================================================================== */
export const steps = style({
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
	gap: "1.5rem",
	"@media": {
		"screen and (max-width: 860px)": { gridTemplateColumns: "1fr" },
	},
});

const panel = {
	// background: vars.color.surface,
	border: `1px solid ${vars.color.border}`,
	borderRadius: vars.radius.md,
} as const;

export const stepCard = style({ ...panel, padding: "1.75rem" });

export const stepTop = style({
	display: "flex",
	alignItems: "center",
	gap: "0.75rem",
	marginBottom: "1.1rem",
});

export const stepBadge = style({
	width: 34,
	height: 34,
	borderRadius: 9,
	background: vars.color.primary,
	color: vars.color.onAccent,
	fontWeight: 700,
	display: "grid",
	placeItems: "center",
});

export const stepEyebrow = style({
	fontSize: "0.7rem",
	letterSpacing: "0.14em",
	textTransform: "uppercase",
	color: vars.color.textMuted,
});

export const stepTitle = style({
	margin: "0 0 0.5rem",
	fontFamily: vars.font.display,
	fontSize: "1.3rem",
	fontWeight: 700,
	color: vars.color.text,
});

export const cardText = style({
	margin: 0,
	color: vars.color.textSecondary,
	lineHeight: 1.55,
	fontSize: "1rem",
});


/* map panel */
export const mapPanel = style({
	position: "relative",
	aspectRatio: "16 / 10",
	borderRadius: 12,
	border: `1px solid ${vars.color.border}`,
	overflow: "hidden",
	background:
		`linear-gradient(135deg, ${vars.map.sea}, ${vars.map.land}),` +
		`repeating-linear-gradient(0deg, transparent 0 47px, color-mix(in srgb, ${vars.map.ink} 25%, transparent) 47px 48px),` +
		`repeating-linear-gradient(90deg, transparent 0 47px, color-mix(in srgb, ${vars.map.ink} 25%, transparent) 47px 48px)`,
});

export const mapLabel = style({
	position: "absolute",
	top: 10,
	left: 12,
	fontSize: "0.62rem",
	letterSpacing: "0.16em",
	textTransform: "uppercase",
	color: vars.map.ink,
});

export const compass = style({
	position: "absolute",
	top: 34,
	left: 26,
	color: vars.map.ink,
	opacity: 0.85,
});

export const mapCaption = style({
	position: "absolute",
	top: "46%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	fontSize: "0.7rem",
	letterSpacing: "0.14em",
	color: `color-mix(in srgb, ${vars.map.ink} 55%, transparent)`,
	whiteSpace: "nowrap",
});

const pinDrop = keyframes({
	"0%": { transform: "translate(-50%, -140%)", opacity: 0 },
	"60%": { opacity: 1 },
	"100%": { transform: "translate(-50%, -100%)", opacity: 1 },
});

export const pin = style({
	position: "absolute",
	transform: "translate(-50%, -100%)",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	animation: `${pinDrop} 500ms ease both`,
	"@media": { "(prefers-reduced-motion: reduce)": { animation: "none" } },
});

export const pinVariant = styleVariants({
	set: { color: vars.color.markerAuthor },
	author: { color: vars.color.markerSetting },
});

export const pinLabel = style({
	marginTop: 2,
	fontSize: "0.62rem",
	color: vars.color.text,
	background: `color-mix(in srgb, ${vars.color.surface} 85%, transparent)`,
	padding: "1px 5px",
	borderRadius: 4,
});

export const legend = style({
	position: "absolute",
	right: 12,
	bottom: 12,
	background: `color-mix(in srgb, ${vars.color.surface} 92%, transparent)`,
	border: `1px solid ${vars.color.border}`,
	borderRadius: 8,
	padding: "0.5rem 0.7rem",
	display: "flex",
	flexDirection: "column",
	gap: "0.3rem",
});

export const legendRow = style({
	display: "flex",
	alignItems: "center",
	gap: "0.4rem",
	fontSize: "0.65rem",
	color: vars.color.textSecondary,
});

/* right-hand feature column */
export const featureCol = style({
	display: "flex",
	flexDirection: "column",
	gap: "1.5rem",
});

export const featureCard = style({ ...panel, padding: "1.6rem" });

export const featureIcon = style({
	width: 44,
	height: 44,
	borderRadius: 11,
	background: primarySoft,
	color: vars.color.primary,
	display: "grid",
	placeItems: "center",
	marginBottom: "1rem",
});

export const featureTitle = style({
	margin: "0 0 0.4rem",
	fontFamily: vars.font.display,
	fontSize: "1.25rem",
	fontWeight: 700,
	color: vars.color.text,
});

export const goalName = style({
	fontFamily: vars.font.display,
	fontWeight: 700,
	fontSize: "1.05rem",
	color: vars.color.text,
});

export const goalCount = style({
	marginLeft: "auto",
	fontSize: "0.95rem",
	color: vars.color.textMuted,
});

export const goalCountNum = style({
	color: vars.color.text,
	fontWeight: 700,
});

export const track = style({
	height: 9,
	borderRadius: 999,
	background: vars.color.stroke,
	overflow: "hidden",
});

export const fill = style({
	height: "100%",
	borderRadius: 999,
	background: vars.color.primary,
});

