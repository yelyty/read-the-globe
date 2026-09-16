import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("html, body", {
	margin: 0,
	fontFamily: vars.font.sans,
});

globalStyle("*", {
	boxSizing: "border-box",
});