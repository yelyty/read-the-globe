import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { vars } from "../../../theme.css";
import { ease } from "../Goals/Goals.css";
import { note } from "../../../components/Field/Field.css";

export const formError = style({
	...note,
	color: vars.color.error,
	background: vars.color.rustWash,
	border: `1px solid ${vars.color.markerAuthor}`,
});
globalStyle(`${formError} svg`, { width: 17, height: 17, flex: "none", marginTop: 1 });


const dialogIn = keyframes({
	from: { opacity: 0, transform: "translateY(14px) scale(.985)" },
	to: { opacity: 1, transform: "none" },
});

export const dialog = style({
	width: 430,
	maxWidth: "calc(100% - 32px)",
	margin: "auto",
	background: vars.color.surface,
	color: vars.color.text,
	border: `1px solid ${vars.color.border}`,
	borderRadius: 10,
	padding: 0,
	boxShadow: "0 30px 80px rgba(60, 48, 20, 0.4)",
	selectors: {
		"&[open]": { animation: `${dialogIn} .22s ${ease}` },
		"&::backdrop": {
			background: "rgba(60, 48, 20, 0.55)",
			backdropFilter: "blur(3px)",
		},
	},
});

export const dialogForm = style({ padding: "32px 32px 34px" });

export const dialogHead = style({
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "space-between",
	gap: 14,
	marginBottom: 26,
});

export const dialogTitle = style({ fontSize: 26 });

export const dialogSub = style({
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textMuted,
	marginTop: 4,
});

export const closeBtn = style({
	flex: "none",
	width: 40,
	height: 40,
	background: vars.color.background,
	border: 0,
	color: vars.color.textSecondary,
	borderRadius: "50%",
	display: "grid",
	placeItems: "center",
	cursor: "pointer",
	":hover": { background: vars.color.backgroundDeep, color: vars.color.text },
});
globalStyle(`${closeBtn} svg`, { width: 18, height: 18 });


export const altAction = style({
	textAlign: "center",
	marginTop: 16,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.textMuted,
});

export const altLink = style({
	background: "none",
	border: 0,
	padding: "11px 6px",
	margin: "-11px -6px",
	fontFamily: vars.font.sans,
	fontSize: 15,
	fontWeight: 500,
	color: vars.color.text,
	textDecoration: "underline",
	textUnderlineOffset: 3,
	cursor: "pointer",
});

const btn = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 10,
	fontFamily: vars.font.sans,
	fontWeight: 500,
	fontSize: 17,
	borderRadius: 999,
	padding: "17px 34px",
	textDecoration: "none",
	border: 0,
	cursor: "pointer",
	transition: "transform .14s, color .14s, background .14s",
	selectors: {
		"&:active": { transform: "translateY(0)" },
		"&[disabled]": { opacity: 0.72, cursor: "progress" },
	},
});
globalStyle(`${btn} svg`, { width: 17, height: 17, flex: "none" });


export const btnPrimary = style([
	btn,
	{
		color: vars.color.onAccent,
		background: vars.color.primary,
	},
]);
// globalStyle(`${btnPrimary}:not([disabled]):hover svg`, {
// 	"@media": { [hover]: { color: c.secondaryBright } },
// });

export const btnBlock = style({
	width: "100%",
	fontSize: 16.5,
	padding: 17,
	marginTop: 6,
});
