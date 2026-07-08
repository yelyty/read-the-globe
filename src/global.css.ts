import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
	margin: 0,
	fontFamily: "system-ui, sans-serif",
});

globalStyle("*", {
	boxSizing: "border-box",
});