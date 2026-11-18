import { getLocale } from '../paraglide/runtime.js';

/**
 * Gets a day as its month and year in the language of the reader, for example "Mar 2026". An empty day gives an empty text.
 */
export const formatMonth = (day: string) =>
  day
    ? new Date(`${day}T12:00:00`).toLocaleDateString(getLocale(), {
        month: 'short',
        year: 'numeric',
      })
    : '';

/**
 * Gets a day in the language of the reader, for example "Mar 9, 2026".
 */
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

/**
 * Gets the postmark date of a reached goal: the day, the month in Roman numerals, and the year in 2 digits, for example "4 X 26".
 */
export const romanDate = (iso: string) => {
  const date = new Date(`${iso}T12:00:00`);

  return `${date.getDate()} ${ROMAN_MONTHS[date.getMonth()]} ${String(date.getFullYear()).slice(-SHORT_YEAR_DIGITS)}`;
};
