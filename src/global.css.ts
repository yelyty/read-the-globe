import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const hover = "(hover: hover)";
export const narrowNav = "screen and (max-width: 1119px)";
export const reducedMotion = "(prefers-reduced-motion: reduce)";
export const coarse = "(pointer: coarse)";
export const tablet = "screen and (max-width: 999px)";
export const phone = "screen and (max-width: 639px)";
export const tiny = "screen and (max-width: 379px)";

globalStyle("html, body", {
	margin: 0,
	fontFamily: vars.font.sans,
});

globalStyle("*", {
	boxSizing: "border-box",
});