import { style, styleVariants, keyframes } from "@vanilla-extract/css";
import { vars } from "../theme.css";

/* ------------------------------------------------------------------ *
 * Local tokens — things NOT in the theme contract.
 * If you add a mono slot to your contract later, swap it here.
 * ------------------------------------------------------------------ */
const mono = "'Space Mono', ui-monospace, 'Courier New', monospace";

/* Derived semi-transparent tint of the primary color. */
const primarySoft = `color-mix(in srgb, ${vars.color.primary} 12%, transparent)`;

/* Airmail barber-pole stripe — references theme colors so it
   shifts between day and night automatically. */
const airmail =
	`repeating-linear-gradient(-45deg,` +
	` ${vars.color.primary} 0 11px, ${vars.color.background} 11px 15px,` +
	` ${vars.color.markerAuthor} 15px 26px, ${vars.color.background} 26px 30px)`;

/* ================================================================== *
 * Shell
 * ================================================================== */
export const wrapper = style({
	minHeight: "100vh",
	background: vars.color.background,
	color: vars.color.textSecondary,
	fontFamily: vars.font.serif,
	fontSize: 17,
	lineHeight: 1.5,
	WebkitFontSmoothing: "antialiased",
});

const shell = {
	width: "100%",
	maxWidth: 1200,
	marginInline: "auto",
	paddingInline: "2rem",
} as const;

/* ================================================================== *
 * Header
 * ================================================================== */
export const header = style({
	...shell,
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	paddingBlock: "1.4rem",
	borderBottom: `1px solid ${vars.color.stroke}`,
});

export const logoWrapper = style({
	display: "flex",
	alignItems: "center",
	gap: "0.6rem",
	color: vars.color.text,
});

export const logoTitle = style({
	fontFamily: vars.font.display,
	fontSize: "1.35rem",
	fontWeight: 700,
	letterSpacing: "-0.01em",
});

export const nav = style({
	display: "flex",
	alignItems: "center",
	gap: "2rem",
	"@media": { "screen and (max-width: 880px)": { display: "none" } },
});

export const navLink = style({
	color: vars.color.textSecondary,
	textDecoration: "none",
	fontSize: "1rem",
	opacity: 0.85,
	transition: "opacity 150ms ease",
	textTransform: "uppercase",
	letterSpacing: "2px",
	fontFamily: mono,
	fontWeight: 700,

	":hover": { opacity: 1 },
});

export const headerActions = style({
	display: "flex",
	alignItems: "center",
	gap: "0.75rem",
});


/* ================================================================== *
 * Hero
 * ================================================================== */
export const hero = style({
	...shell,
	paddingBlock: "4rem",
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: "3.5rem",
	"@media": {
		"screen and (max-width: 980px)": {
			gridTemplateColumns: "1fr",
			gap: "2.5rem",
			paddingBlock: "2.5rem",
		},
	},
});

export const heroText = style({
	display: "flex",
	flexDirection: "column",
	gap: "1.5rem",
	paddingTop: "1rem",
});


export const kicker = style({
	textTransform: "uppercase",
	letterSpacing: "2px",
	fontFamily: mono,
	fontSize: "0.72rem",
	fontWeight: 700,
	color: vars.color.textMuted,
})

export const head = style({
	margin: 0,
	fontFamily: vars.font.display,
	fontWeight: 700,
	fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
	lineHeight: 1.02,
	letterSpacing: "-0.02em",
	color: vars.color.text,
});

export const sub = style({
	margin: 0,
	fontSize: "1.15rem",
	lineHeight: 1.6,
	color: vars.color.textSecondary,

});

export const checklist = style({
	listStyle: "none",
	margin: "0.5rem 0 0",
	padding: 0,
	display: "flex",
	flexDirection: "column",
	gap: "1rem",
});

export const checkItem = style({
	display: "flex",
	gap: "0.75rem",
	alignItems: "flex-start",
	fontSize: "1.05rem",
	color: vars.color.textSecondary,
});

export const checkIcon = style({
	flexShrink: 0,
	marginTop: 2,
	width: 22,
	height: 22,
	borderRadius: 999,
	border: `1.5px solid ${vars.color.primary}`,
	color: vars.color.primary,
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
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
		background: airmail,
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
	fontFamily: mono,
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
 * Airmail divider
 * ================================================================== */
export const divider = style({
	...shell,
	height: 6,
	borderRadius: 3,
	background: airmail,
	marginBlock: "1rem",
});

/* ================================================================== *
 * Section scaffolding
 * ================================================================== */
export const section = style({ ...shell, paddingBlock: "4rem" });

export const sectionHead = style({
	textAlign: "center",
	maxWidth: 640,
	margin: "0 auto 3rem",
});

export const eyebrow = style({
	fontFamily: mono,
	fontSize: "0.72rem",
	fontWeight: 700,
	letterSpacing: "0.16em",
	textTransform: "uppercase",
	color: vars.color.textMuted,
});

export const sectionTitle = style({
	margin: "0.6rem 0 0.8rem",
	fontFamily: vars.font.display,
	fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
	fontWeight: 700,
	letterSpacing: "-0.015em",
	color: vars.color.text,
});

export const sectionLead = style({
	margin: 0,
	fontSize: "1.1rem",
	lineHeight: 1.6,
	color: vars.color.textSecondary,
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
	background: vars.color.surface,
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
	fontFamily: mono,
	fontWeight: 700,
	display: "grid",
	placeItems: "center",
});

export const stepEyebrow = style({
	fontFamily: mono,
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

/* ================================================================== *
 * The Atlas
 * ================================================================== */
export const atlasGrid = style({
	...shell,
	paddingBlock: "1rem 4rem",
	display: "grid",
	gridTemplateColumns: "1.55fr 1fr",
	gap: "1.5rem",
	alignItems: "start",
	"@media": {
		"screen and (max-width: 980px)": { gridTemplateColumns: "1fr" },
	},
});

export const atlasCard = style({ ...panel, padding: "2rem" });

export const atlasTitle = style({
	margin: "0.5rem 0 0.6rem",
	fontFamily: vars.font.display,
	fontSize: "1.7rem",
	fontWeight: 700,
	color: vars.color.text,
});

export const atlasBody = style({
	margin: "0 0 1.5rem",
	color: vars.color.textSecondary,
	lineHeight: 1.6,
	maxWidth: "48ch",
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
	fontFamily: mono,
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
	fontFamily: mono,
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
	fontFamily: mono,
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
	fontFamily: mono,
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

/* ================================================================== *
 * Reading goals
 * ================================================================== */
export const goalsSection = style({ ...shell, paddingBlock: "1rem 4rem" });

export const goalsCard = style({
	...panel,
	padding: "2.5rem",
	display: "grid",
	gridTemplateColumns: "1fr 1.2fr",
	gap: "3rem",
	alignItems: "center",
	"@media": {
		"screen and (max-width: 900px)": {
			gridTemplateColumns: "1fr",
			gap: "2rem",
		},
	},
});

export const goalsTitle = style({
	margin: "0.5rem 0 0.8rem",
	fontFamily: vars.font.display,
	fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
	fontWeight: 700,
	lineHeight: 1.1,
	color: vars.color.text,
});

export const chips = style({
	display: "flex",
	flexWrap: "wrap",
	gap: "0.6rem",
	marginTop: "1.2rem",
});

export const chip = style({
	padding: "0.4rem 0.9rem",
	borderRadius: 999,
	border: `1px solid ${vars.color.border}`,
	background: vars.color.surface,
	color: vars.color.textSecondary,
	fontFamily: vars.font.serif,
	fontSize: "0.9rem",
});

export const goalRows = style({
	display: "flex",
	flexDirection: "column",
	gap: "1.4rem",
});

export const goalRow = style({ display: "block" });

export const goalHead = style({
	display: "flex",
	alignItems: "center",
	gap: "0.6rem",
	marginBottom: "0.5rem",
});

export const goalIcon = style({
	width: 30,
	height: 30,
	borderRadius: 8,
	background: primarySoft,
	color: vars.color.primary,
	display: "grid",
	placeItems: "center",
	flexShrink: 0,
});

export const goalName = style({
	fontFamily: vars.font.display,
	fontWeight: 700,
	fontSize: "1.05rem",
	color: vars.color.text,
});

export const goalCount = style({
	marginLeft: "auto",
	fontFamily: mono,
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

/* ================================================================== *
 * CTA band
 * ================================================================== */
export const ctaWrap = style({ ...shell, paddingBottom: "4rem" });

export const cta = style({
	position: "relative",
	background: vars.color.primary,
	borderRadius: 18,
	padding: "3.5rem 2rem 3rem",
	textAlign: "center",
	overflow: "hidden",
	"::before": {
		content: '""',
		position: "absolute",
		insetInline: 0,
		top: 0,
		height: 9,
		background: airmail,
	},
});

export const ctaTitle = style({
	margin: "0.5rem 0 0.8rem",
	fontFamily: vars.font.display,
	fontSize: "clamp(2rem, 4.5vw, 2.9rem)",
	fontWeight: 700,
	color: vars.color.onAccent,
});

export const ctaText = style({
	margin: "0 auto 1.8rem",
	maxWidth: "40ch",
	fontSize: "1.1rem",
	lineHeight: 1.6,
	color: `color-mix(in srgb, ${vars.color.onAccent} 85%, transparent)`,
});

export const ctaBtn = style({
	display: "inline-flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.9rem 1.6rem",
	borderRadius: vars.radius.md,
	border: "none",
	background: vars.color.onAccent,
	color: vars.color.primary,
	fontFamily: vars.font.serif,
	fontSize: "1.05rem",
	fontWeight: 700,
	cursor: "pointer",
	transition: "transform 120ms ease, opacity 150ms ease",
	":hover": { opacity: 0.92 },
	":active": { transform: "translateY(1px)" },
});