import { createTheme } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
	font: {
		display: '"IM Fell English", Georgia, serif',
		serif: '"EB Garamond", Georgia, serif',
		sans: '"DM Sans", system-ui, sans-serif',
	},

	color: {
		primary: '#4A6A40',
		secondary: '#C7A536',
		primaryHover: '#3C5734',
		onAccent: '#F5E6B8',

		background: '#F8EDD0',
		surface: '#FDF6E3',
		overlay: 'rgba(43, 30, 10, 0.55)',

		text: '#3A2E14',
		textSecondary: '#6E5733',
		textMuted: '#8E764A',
		textDisabled: '#BCA56E',

		stroke: '#CDB16F',
		border: '#CDB16F',

		error: '#7E3030',
		success: '#5F7445',

		markerAuthor: '#8B3A33',
		markerSetting: '#6F7A3B',

		olive: '#6F7445',
		star: '#C7A536',
	},

	map: {
		sea: '#F3D89A',
		land: '#D4B566',
		ink: '#AE8F44',
	},

	radius: {
		md: '15px',
	},
});

export const darkThemeClass = createTheme(vars, {
	font: {
		display: '"IM Fell English", Georgia, serif',
		serif: '"EB Garamond", Georgia, serif',
		sans: '"DM Sans", system-ui, sans-serif',
	},

	color: {
		primary: '#6E9466',
		secondary: '#E2BD58',
		primaryHover: '#5E8457',
		onAccent: '#1C1509',

		background: '#1C1509',
		surface: '#271E11',
		overlay: 'rgba(0, 0, 0, 0.62)',

		text: '#EEE3C8',
		textSecondary: '#BBA274',
		textMuted: '#8E7C56',
		textDisabled: '#5F543B',

		stroke: '#3D3120',
		border: '#3D3120',

		error: '#C2504A',
		success: '#8AA85C',

		markerAuthor: '#C2504A',
		markerSetting: '#93A155',

		olive: '#93A155',
		star: '#E2BD58',
	},

	map: {
		sea: '#2A2412',
		land: '#4C4128',
		ink: '#71603C',
	},

	radius: {
		md: '15px',
	},
});