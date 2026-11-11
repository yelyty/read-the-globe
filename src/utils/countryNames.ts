import { getLocale } from '../paraglide/runtime.js';
import { toAlpha2 } from './toIsoNumeric';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';

let english: Record<string, string> | null = null;
let cache: Record<string, string> | null = null;

/** the map's own English name for a code, once getCountryNames() has run; typed names match it in any language */
export const englishName = (code: string) => english?.[code];

// code → name in the reader's language: the browser's own Intl.DisplayNames, the map's English name where it has none
export async function getCountryNames(): Promise<Record<string, string>> {
  if (cache) return cache;

  const topo = (await fetch(GEO_URL).then((response) => response.json())) as {
    objects: {
      countries: {
        geometries: Array<{ id: string; properties: { name: string } }>;
      };
    };
  };

  const geometries = topo.objects.countries.geometries;

  english = Object.fromEntries(
    geometries
      .filter((geometry) => geometry.id)
      .map((geometry) => [geometry.id, geometry.properties.name])
  );

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
