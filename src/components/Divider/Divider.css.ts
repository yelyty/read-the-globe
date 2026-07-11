import { recipe } from "@vanilla-extract/recipes";
import { vars } from "../../theme.css";


export const divider = recipe({
	base: {
		border: "none",
		marginInline: "auto",
	},
	variants: {
		orientation: {
			horizontal: {
				width: "100%",
				maxWidth: 1200,
				borderTop: `1px solid ${vars.color.stroke}`,
			},
			vertical: {
				alignSelf: "stretch",
				borderLeft: `1px solid ${vars.color.stroke}`,
				marginBlock: "auto",
			},
		},
	},
	defaultVariants: {
		orientation: "horizontal",
	},
});