import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "../../theme.css";

export const button = style({
	position: "relative",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "space-between",
	boxSizing: "border-box",
	width: 70,
	height: 40,
	padding: "0 5px",
	borderRadius: vars.radius.md,
	backgroundColor: "transparent",
	border: `1px solid ${vars.color.primary}`,
	cursor: "pointer",
	flexShrink: 0,
	zIndex: 1000,
});

const iconBase = {
	width: 28,
	height: 28,
	position: "relative",
	transition: "color 120ms ease",
} as const;

export const sunIcon = recipe({
	base: iconBase,
	variants: {
		dark: {
			true: { color: vars.color.textDisabled },
			false: { color: vars.color.secondary },
		},
	},
	defaultVariants: { dark: false },
});

export const moonIcon = recipe({
	base: iconBase,
	variants: {
		dark: {
			true: { color: vars.color.secondary },
			false: { color: vars.color.textDisabled },
		},
	},
	defaultVariants: { dark: false },
});

export const thumb = recipe({
	base: {
		position: "absolute",
		top: "50%",
		left: 4,
		width: 30,
		height: 30,
		borderRadius: "50%",
		backgroundColor: vars.color.primary,
		transition: "transform 120ms ease",
	},
	variants: {
		dark: {
			true: { transform: "translate(30px, -50%)" },
			false: { transform: "translate(0, -50%)" },
		},
	},
	defaultVariants: { dark: false },
});

export type SunIconVariants = RecipeVariants<typeof sunIcon>;
export type MoonIconVariants = RecipeVariants<typeof moonIcon>;
export type ThumbVariants = RecipeVariants<typeof thumb>;