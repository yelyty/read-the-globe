// ISO dates are 'YYYY-MM-DD': the year is the first 4 characters, year and month the first 7, the whole day 10
const YEAR_END = 4;
const MONTH_START = 5;
const MONTH_END = 7;
const DAY_END = 10;

/** 'YYYY' */
export const isoYear = (iso: string) => iso.slice(0, YEAR_END);
/** 'YYYY-MM' */
export const isoYearMonth = (iso: string) => iso.slice(0, MONTH_END);
/** 'MM' */
export const isoMonth = (iso: string) => iso.slice(MONTH_START, MONTH_END);
/** 'YYYY-MM-DD', from a date or a full timestamp */
export const isoDay = (iso: string) => iso.slice(0, DAY_END);
