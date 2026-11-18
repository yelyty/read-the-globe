import { getLocale } from '../paraglide/runtime.js';
import { toAlpha2 } from './toIsoNumeric';
import { worldNames } from './world';

let english: Record<string, string> | null = null;
let cache: Record<string, string> | null = null;

/**
 * Gets the English name of a country, as the map has it. It is known only after getCountryNames() has run.
 */
export const englishName = (code: string) => english?.[code];

/**
 * Gets the names of all countries on the map, in the language of the reader.
 * The names come from the browser. If the browser has no name for a country, the English name of the map is used.
 * The function loads the names once, and then gives them from its cache.
 * @returns The names, by country code.
 */
export async function getCountryNames(): Promise<Record<string, string>> {
  if (cache) return cache;

  // the map's own names, so every country it draws has one
  english = await worldNames();

  const locale = getLocale();

  if (locale === 'en') return (cache = english);
  let dn: Intl.DisplayNames | null = null;

  try {
    dn = new Intl.DisplayNames([locale], { type: 'region' });
  } catch {
    // an old browser: English names
  }

  cache = Object.fromEntries(
    Object.entries(english).map(([code, name]) => {
      const a2 = toAlpha2(code);
      const local = a2 && dn?.of(a2);

      return [code, local && local !== a2 ? local : name];
    })
  );

  return cache;
}
