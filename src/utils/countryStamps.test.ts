import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import map from '../../public/countries-50m.json?raw';
import { countryStamp, loadCountries } from './countryStamps';

const RUSSIA = '643';
const FRANCE = '250';

beforeAll(() =>
  vi.stubGlobal('fetch', () => Promise.resolve(new Response(map)))
);

afterAll(() => vi.unstubAllGlobals());

describe('country stamps', () => {
  it('frames every map country, once however often asked', async () => {
    const [first, again] = await Promise.all([
      loadCountries(),
      loadCountries(),
    ]);

    expect(first).toBe(again);
    expect(first.size).toBeGreaterThan(200);
  });

  it('frames Russia on its mainland, not the whole width of the world', async () => {
    const russia = (await loadCountries()).get(RUSSIA)!;
    const [[x0], [x1]] = russia.main;

    // the flat world is 1000 across: a frame wrapping the date line would span nearly all of it
    expect(x1 - x0).toBeLessThan(500);
  });

  it('draws a stamp as an SVG path with room round the country', async () => {
    const france = (await loadCountries()).get(FRANCE)!;
    const stamp = countryStamp(france);
    const [[x0], [x1]] = france.main;

    expect(stamp.d).toMatch(/^M/);
    expect(stamp.width).toBeGreaterThan(x1 - x0);
    expect(stamp.viewBox.split(' ')).toHaveLength(4);
  });
});
