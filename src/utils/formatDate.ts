import { getLocale } from '../paraglide/runtime.js';

export const formatMonth = (day: string) =>
  day
    ? new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
        month: 'short',
        year: 'numeric',
      })
    : '';

export const formatDay = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

// the postmark's date, for a reached goal's stamp: "4 X 26"
// '26 for 2026
const SHORT_YEAR_DIGITS = 2;

const ROMAN_MONTHS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
];

export const romanDate = (iso: string) => {
  const date = new Date(`${iso}T12:00:00`);

  return `${date.getDate()} ${ROMAN_MONTHS[date.getMonth()]} ${String(date.getFullYear()).slice(-SHORT_YEAR_DIGITS)}`;
};
