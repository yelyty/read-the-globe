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
