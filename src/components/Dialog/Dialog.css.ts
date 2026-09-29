import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const overlay = style({
	position: "fixed",
	inset: 0,
	zIndex: 1000,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	background: vars.color.overlay
})

export const dialog = style({
	position: 'relative',
	width: "90%",
	maxWidth: 500,
	maxHeight: "90vh",
	overflowY: "auto",
	background: vars.color.background,
	borderRadius: vars.radius.md,
	boxShadow: "0 4px 20px rgba(0,0,0, 0.15)",
})

export const header = style({
	padding: 24,
	paddingRight: 56
})


export const closeButton = style({
	position: "absolute",
	top: 20,
	right: 20,
	zIndex: 1,
	display: 'flex',
	alignItems: "center",
	justifyContent: "center",
	padding: 0,
	background: "none",
	border: "none",
	borderRadius: vars.radius.md,
	color: vars.color.textSecondary,
	cursor: "pointer",
	":hover": {
		background: vars.color.surface
	}
})


export const content = style({
	padding: 24,
	paddingTop: 0,
})