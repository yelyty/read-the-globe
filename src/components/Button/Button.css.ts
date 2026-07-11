import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "../../theme.css";

export const button = recipe({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "14px",
		fontWeight: 500,
		lineHeight: 1,
		paddingBlock: "0.75rem",
		paddingInline: "1rem",
		borderRadius: vars.radius.md,
		cursor: "pointer",
		transition: "background-color 120ms ease, color 120ms ease",
		border: "1px solid transparent",
		":disabled": {
			opacity: 0.5,
			cursor: "not-allowed",
		},
		// 		//
		// 		  outline: none;
		//   background-color: var(--color-primary);
		//   color: var(--on-accent);
		//   border: none;
		//   padding: 0.75rem 1rem;
		//   border-radius: var(--radius);
		//   cursor: pointer;
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
		},
	},

	defaultVariants: {
		variant: "contained",
	},
});

export type ButtonVariants = RecipeVariants<typeof button>;
