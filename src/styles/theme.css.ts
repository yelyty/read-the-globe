import { assignVars, createThemeContract, globalStyle } from '@vanilla-extract/css';

export const vars = createThemeContract({
	font: {
		display: null,
		serif: null,
		sans: null,
		wordmark: null,
	},

	color: {
		primary: null,
		primaryHover: null,
		primaryLine: null,
		secondary: null,
		secondaryBright: null,
		onAccent: null,
		onAccentBody: null,
		onAccentMuted: null,
		accent: null,

		background: null,
		backgroundDeep: null,
		surface: null,
		field: null,
		fieldLine: null,
		headerBackground: null,
		overlay: null,

		text: null,
		textSecondary: null,
		textMuted: null,
		textDisabled: null,

		stroke: null,
		border: null,

		error: null,
		success: null,

		markerAuthor: null,
		markerSetting: null,
		rustWash: null,
		oliveWash: null,
		oliveInk: null,

		olive: null,
		star: null,
		mark: null,
	},

	map: {
		sea: null,
		land: null,
		ink: null,
	},

	shadow: {
		ink: null,
		gold: null,
	},

	radius: {
		md: null,
	},
});

const font = {
	display: "Alegreya, Georgia, 'Times New Roman', serif",
	serif: "'EB Garamond', Georgia, 'Times New Roman', serif",
	sans: "'Alegreya Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
	wordmark: "'IM Fell English', Georgia, serif",
};
const light = {
	font,

	color: {
		primary: "#4A6A40",
		primaryHover: "#3C5734",
		primaryLine: "#55703F",
		secondary: "#C7A536",
		secondaryBright: "#E2BD58",
		onAccent: "#F5E6B8",
		onAccentBody: "#DDCCA6",
		onAccentMuted: "#D3C59B",
		accent: "#4A6A40",

		background: "#F6F0E2",
		backgroundDeep: "#F3D89A",
		surface: "#F8EDD0",
		field: "#FCF8EE",
		fieldLine: "#9A7F35",
		headerBackground: "rgba(246, 240, 226, 0.92)",
		overlay: "rgba(60, 48, 20, 0.55)",

		text: "#3A2E14",
		textSecondary: "#6E5733",
		textMuted: "#7C673F",
		textDisabled: "#BCA56E",

		stroke: "#CDB16F",
		border: "#CDB16F",

		error: "#8B3A33",
		success: "#5F7445",

		markerAuthor: "#8B3A33",
		markerSetting: "#6F7A3B",
		rustWash: "#F0DCD6",
		oliveWash: "#DCE3B7",
		oliveInk: "#33502B",

		olive: "#6F7A3B",
		star: "#C7A536",
		mark: "#9A7F35",
	},

	map: {
		sea: "#F8EDD0",
		land: "#F5E1B2",
		ink: "#CDB16F",
	},

	shadow: {
		ink: "58, 46, 20",
		gold: "122, 98, 42",
	},

	radius: {
		md: "10px",
	},
};

const dark = {
	font,

	color: {
		primary: "#4E6D44",
		primaryHover: "#28381F",
		primaryLine: "#3B5230",
		secondary: "#D9B94F",
		secondaryBright: "#E8CB6A",
		onAccent: "#F5E6B8",
		onAccentBody: "#DDCCA6",
		onAccentMuted: "#D3C59B",
		accent: "#8DAE7C",

		background: "#1C1811",
		backgroundDeep: "#2A2418",
		surface: "#241F15",
		field: "#1C1811",
		fieldLine: "#7A6A45",
		headerBackground: "rgba(28, 24, 17, 0.92)",
		overlay: "rgba(0, 0, 0, 0.62)",

		text: "#F2E6C6",
		textSecondary: "#C6B389",
		textMuted: "#A8955F",
		textDisabled: "#5F543B",

		stroke: "#4C4029",
		border: "#4C4029",

		error: "#E08A7E",
		success: "#8AA85C",

		markerAuthor: "#D07A6F",
		markerSetting: "#A3B06A",
		rustWash: "#3A2A26",
		oliveWash: "#2E3320",
		oliveInk: "#C9D69A",

		olive: "#A3B06A",
		star: "#D9B94F",
		mark: "#6B5A2E",
	},

	map: {
		sea: "#241F15",
		land: "#433927",
		ink: "#4C4029",
	},

	shadow: {
		ink: "0, 0, 0",
		gold: "0, 0, 0",
	},

	radius: {
		md: "15px",
	},
};

globalStyle(":root", {
	vars: assignVars(vars, light),
	colorScheme: "light",
	"@media": {
		"(prefers-color-scheme: dark)": { vars: assignVars(vars, dark), colorScheme: "dark" },
	},
});
globalStyle(':root[data-theme="light"]', { vars: assignVars(vars, light), colorScheme: "light" });
globalStyle(':root[data-theme="dark"]', { vars: assignVars(vars, dark), colorScheme: "dark" });

