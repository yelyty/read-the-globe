import { createElement, type ReactNode } from 'react';

import { getLocale } from '../paraglide/runtime.js';

/**
 * Removes accents and makes a text lower case, so a search for "capek" finds Čapek.
 */
export const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Makes a text lower case, with the rules of the language of the reader.
 */
export const lower = (text: string) => text.toLocaleLowerCase(getLocale());

/** a message's **bold** parts as <b> */
export const withBold = (text: string): ReactNode[] =>
  text
    .split('**')
    .map((part, i) => (i % 2 ? createElement('b', { key: i }, part) : part));

/** countries by name, in the reader's alphabet: "Denmark, Iceland, Norway" */
export const byName = (codes: string[], name: (code: string) => string) =>
  codes
    .map(name)
    .sort((first, second) => first.localeCompare(second, getLocale()))
    .join(', ');
