import { getLocale } from '../paraglide/runtime.js';
import { toAlpha2 } from './toIsoNumeric';
import { worldNames } from './world';

let english: Record<string, string> | null = null;
let cache: Record<string, string> | null = null;

/** the map's own English name for a code, once getCountryNames() has run; typed names match it in any language */
export const englishName = (code: string) => english?.[code];

// code → name in the reader's language: the browser's own Intl.DisplayNames, the map's English name where it has none
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
