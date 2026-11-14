import { getLocale } from '../paraglide/runtime.js';

// "hoeg" finds Høeg: accents don't block a match
export const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const lower = (text: string) => text.toLocaleLowerCase(getLocale());
