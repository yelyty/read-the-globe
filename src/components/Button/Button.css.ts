import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "../../theme.css";

export const button = recipe({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "14px",
		gap: "0.5rem",
		fontFamily: "inherit",
		fontWeight: 500,
		lineHeight: 1,
		textDecoration: 'none',
		paddingBlock: "0.75rem",
		paddingInline: "1rem",
		borderRadius: "999px",
		cursor: "pointer",
		transition: "background-color 120ms ease, color 120ms ease",
		border: "1px solid transparent",
		":disabled": {
			opacity: 0.5,
			cursor: "not-allowed",
			transform: 'none',
		},
	},

	variants: {
		variant: {
			contained: {
				backgroundColor: vars.color.primary,
				color: vars.color.onAccent,
				selectors: {
					"&:not(:disabled):hover": {
						backgroundColor: vars.color.primaryHover,
					},
				},
			},
			outlined: {
				backgroundColor: "transparent",
				color: vars.color.text,
				borderColor: vars.color.primary,
				selectors: {
					"&:not(:disabled):hover": {
						backgroundColor: "rgba(0, 112, 243, 0.08)",
					},
				},
			},
			text: {
				backgroundColor: "transparent",
				color: vars.color.primary,
				paddingInline: "0.5rem",
			}
		},
		size: {
			sm: {
				fontSize: "13px",
				paddingBlock: "0.5rem",
				paddingInline: "0.75rem"
			},
			md: {
				fontSize: "14px",
				paddingBlock: "0.75rem",
				paddingInline: "1rem",
			},
			lg: {
				fontSize: "16px",
				paddingBlock: "0.875rem",
				paddingInline: "1.5rem"
			}
		},
	},

	defaultVariants: {
		variant: "contained",
	},
});

export type ButtonVariants = RecipeVariants<typeof button>;
