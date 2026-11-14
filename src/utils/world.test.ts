import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import map from '../../public/countries-50m.json?raw';
import { getCountryNames } from './countryNames';
import { countryFrom } from './countryFrom';
import { CONTINENT_OF } from './continents';
import { GEO_URL, MAP_CODES, worldNames, worldShapes } from './world';

// the real map file, as the app serves it from /public
const fetchMap = vi.fn<(url: string) => Promise<Response>>(() =>
  Promise.resolve(new Response(map))
);

beforeAll(() => vi.stubGlobal('fetch', fetchMap));
afterAll(() => vi.unstubAllGlobals());

describe('world', () => {
  it('loads the map once, however many parts of the app ask', async () => {
    await Promise.all([worldShapes(), worldNames(), getCountryNames()]);

    expect(fetchMap).toHaveBeenCalledTimes(1);
    expect(fetchMap).toHaveBeenCalledWith(GEO_URL);
  });

  // a country the map draws but can't name could never be typed in, so never marked (Malta, Singapore…)
  it('names every country it draws', async () => {
    const shapes = await worldShapes();
    const names = await getCountryNames();

    expect(Object.keys(shapes).length).toBeGreaterThan(0);
    expect(Object.keys(names).sort()).toEqual(Object.keys(shapes).sort());
  });

  // the list goals count from, kept in step with the map file
  it('lists every country it draws in MAP_CODES, and nothing else', async () => {
    const codes = Object.keys(await worldShapes());

    expect([...MAP_CODES].sort()).toEqual(codes.sort());
  });

  it('puts every country it draws on a continent', async () => {
    const codes = Object.keys(await worldShapes());

    expect(codes.filter((code) => !CONTINENT_OF[code])).toEqual([]);
  });

  it('lets a reader type the small countries in', async () => {
    const names = await getCountryNames();

    for (const [typed, code] of [
      ['Malta', '470'],
      ['Singapore', '702'],
      ['Monaco', '492'],
      ['Vatican', '336'],
    ])
      expect(countryFrom(typed, names, '')?.code).toBe(code);
  });
});
