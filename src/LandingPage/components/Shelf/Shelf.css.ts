import { style } from "@vanilla-extract/css";
import { tablet } from "../../../global.css";
import { vars } from "../../../theme.css";

export const h2 = style({ fontSize: "clamp(38px, 5vw, 54px)", lineHeight: 1 });

export const lede = style({
	marginTop: 18,
	fontSize: 18.5,
	fontWeight: 500,
	color: vars.color.textSecondary,
});

export const shelfNote = style({
	marginTop: 22,
	fontSize: 17.5,
	fontWeight: 500,
	color: vars.color.textSecondary,
	textWrap: "pretty",
});


export const shelfBlock = style({
	display: "grid",
	gridTemplateColumns: "minmax(0, 46ch) auto",
	justifyContent: "center",
	gap: "clamp(32px, 4vw, 68px)",
	alignItems: "center",
	"@media": { [tablet]: { gridTemplateColumns: "minmax(0, 1fr)" } },
});