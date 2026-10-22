
import { globalStyle, keyframes, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../../../../styles/theme.css";

const ease = "cubic-bezier(.23, 1, .32, 1)";
const small = "screen and (max-width: 479px)";

const dialogIn = keyframes({
	from: { opacity: 0, transform: "translateY(14px) scale(.985)" },
	to: { opacity: 1, transform: "none" },
});

export const dialog = style({
	width: "min(560px, 100% - 32px)",
	maxHeight: "calc(100dvh - 32px)",
	margin: "auto",
	background: vars.color.background,
	color: vars.color.text,
	border: 0,
	borderRadius: 24,
	padding: 0,
	selectors: {
		"&[open]": { animation: `${dialogIn} .2s ${ease}` },
		"&::backdrop": { background: "rgba(28, 24, 17, 0.48)" },
	},
	"@media": {
		"(prefers-reduced-motion: reduce)": { selectors: { "&[open]": { animation: "none" } } },
	},
});

export const dialogForm = style({ padding: 40, "@media": { [small]: { padding: 24 } } });

export const dialogHead = style({
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "space-between",
	gap: 16,
	marginBottom: 24,
});

export const dialogTitle = style({
	margin: 0,
	fontFamily: vars.font.sans,
	fontWeight: 800,
	fontSize: 32,
	lineHeight: 1.05,
	letterSpacing: "-.025em",
	textWrap: "balance",
	"@media": { [small]: { fontSize: 28 } },
});

export const dialogSub = style({
	margin: "8px 0 0",
	fontSize: 16,
	color: vars.color.textSecondary,
	textWrap: "pretty",
});

export const closeBtn = style({
	flex: "none",
	display: "grid",
	placeItems: "center",
	width: 40,
	height: 40,
	margin: "-8px -8px 0 0",
	background: vars.color.backgroundDeep,
	border: 0,
	borderRadius: "50%",
	color: vars.color.textSecondary,
	cursor: "pointer",
	":hover": { color: vars.color.text },
});
globalStyle(`${closeBtn} svg`, { width: 18, height: 18 });

const note = {
	display: "flex",
	gap: 8,
	alignItems: "flex-start",
	margin: "0 0 16px",
	padding: "12px 16px",
	borderRadius: 12,
	fontFamily: vars.font.sans,
	fontSize: 15,
	lineHeight: 1.4,
} as const;

export const formError = style({
	...note,
	color: vars.color.error,
	background: vars.color.rustWash,
	border: `1px solid ${vars.color.markerAuthor}`,
});
globalStyle(`${formError} svg`, { width: 17, height: 17, flex: "none", marginTop: 1 });

export const formNotice = style({
	...note,
	fontWeight: 500,
	color: vars.color.oliveInk,
	background: vars.color.oliveWash,
});

/* ---------- password strength ---------- */
export const strength = style({ display: "flex", alignItems: "center", gap: 8, marginTop: 8 });

export const strengthBar = style({
	flex: 1,
	height: 4,
	borderRadius: 999,
	background: vars.color.backgroundDeep,
	overflow: "hidden",
});

const strengthFillBase = style({
	height: "100%",
	width: "100%",
	transformOrigin: "left center",
	borderRadius: 999,
	transition: `transform .2s ${ease}, background .2s ${ease}`,
});
export const strengthFill = styleVariants({
	0: [strengthFillBase, { background: vars.color.error }],
	1: [strengthFillBase, { background: vars.color.error }],
	2: [strengthFillBase, { background: vars.color.secondary }],
	3: [strengthFillBase, { background: vars.color.primary }],
	4: [strengthFillBase, { background: vars.color.primary }],
});

export const strengthLabel = style({
	fontFamily: vars.font.sans,
	fontSize: 14,
	color: vars.color.textMuted,
	whiteSpace: "nowrap",
});

/* ---------- buttons ---------- */
const btn = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 10,
	padding: "17px 34px",
	border: 0,
	borderRadius: 999,
	fontFamily: vars.font.sans,
	fontWeight: 500,
	fontSize: 17,
	textDecoration: "none",
	cursor: "pointer",
	transition: `transform .14s ${ease}, background .14s ${ease}`,
	selectors: {
		"&:active": { transform: "scale(.97)" },
		"&[disabled]": { opacity: 0.72, cursor: "progress" },
	},
});
globalStyle(`${btn} svg`, { width: 17, height: 17, flex: "none" });

export const btnPrimary = style([
	btn,
	{
		color: vars.color.onAccent,
		background: vars.color.primary,
		":hover": { background: vars.color.primaryHover },
	},
]);

export const btnBlock = style({ width: "100%", padding: 17, marginTop: 8 });

export const altAction = style({
	margin: "16px 0 0",
	fontFamily: vars.font.sans,
	fontSize: 15,
	lineHeight: 1.4,
	color: vars.color.textSecondary,
});

export const altLink = style({
	padding: "12px 4px",
	margin: "-12px -4px",
	background: "none",
	border: 0,
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.text,
	textDecoration: "underline",
	textUnderlineOffset: 4,
	cursor: "pointer",
});