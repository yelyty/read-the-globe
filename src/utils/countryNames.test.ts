import { beforeEach, describe, expect, it, vi } from 'vitest';

// the map's names and the page's language, as stand-ins
const page = vi.hoisted(() => ({ locale: 'cs' }));

const worldNames = vi.hoisted(() =>
  vi.fn(() =>
    Promise.resolve<Record<string, string>>({
      '250': 'France',
      '392': 'Japan',
      // Kosovo: no ISO alpha-2, so no browser name; the map's own stays
      '-99': 'Kosovo',
    })
  )
);

vi.mock('./world', () => ({ worldNames }));
vi.mock('../paraglide/runtime.js', () => ({ getLocale: () => page.locale }));

// each test gets a fresh module, so its cache starts empty
const load = async () => {
  vi.resetModules();

  return import('./countryNames');
};

beforeEach(() => {
  vi.clearAllMocks();
  page.locale = 'cs';
});

describe('getCountryNames', () => {
  it('gives the map’s own English names to an English reader', async () => {
    page.locale = 'en';
    const { getCountryNames } = await load();

    expect(await getCountryNames()).toEqual({
      '250': 'France',
      '392': 'Japan',
      '-99': 'Kosovo',
    });
  });

  it('names countries in the reader’s language, and keeps English where the browser has no name', async () => {
    const { getCountryNames } = await load();
    const names = await getCountryNames();

    expect(names['250']).toBe('Francie');
    expect(names['392']).toBe('Japonsko');
    expect(names['-99']).toBe('Kosovo');
  });

  it('reads the map once and answers from its cache after that', async () => {
    const { getCountryNames } = await load();
    const first = await getCountryNames();

    expect(await getCountryNames()).toBe(first);
    expect(worldNames).toHaveBeenCalledTimes(1);
  });

  it('falls back to English when the browser can’t name regions', async () => {
    vi.stubGlobal('Intl', {
      ...Intl,
      DisplayNames: function () {
        throw new RangeError('unsupported');
      },
    });

    try {
      const { getCountryNames } = await load();

      expect((await getCountryNames())['250']).toBe('France');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('englishName', () => {
  it('knows no names before the map is read', async () => {
    const { englishName } = await load();

    expect(englishName('250')).toBeUndefined();
  });

  it('gives the map’s English name in any language once it is read', async () => {
    const { englishName, getCountryNames } = await load();

    await getCountryNames();

    expect(englishName('250')).toBe('France');
  });
});
