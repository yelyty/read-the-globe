import { createElement, type ReactNode } from 'react';

import { getLocale } from '../paraglide/runtime.js';

// "hoeg" finds Høeg: accents don't block a match
export const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

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
