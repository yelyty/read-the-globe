import { describe, expect, it } from 'vitest';

import {
  CONTINENT_NAMES,
  CONTINENT_OF,
  continentName,
  type Continent,
} from './continents';

describe('continents', () => {
  it('names each continent in the reader’s language', () => {
    for (const continent of Object.keys(CONTINENT_NAMES) as Continent[])
      expect(continentName(continent)).toBe(CONTINENT_NAMES[continent]);
  });

  it('places countries on their continent', () => {
    expect(CONTINENT_OF['250']).toBe('EU');
    expect(CONTINENT_OF['392']).toBe('AS');
    expect(CONTINENT_OF['076']).toBe('SA');
    expect(CONTINENT_OF['036']).toBe('OC');
    expect(CONTINENT_OF['840']).toBe('NA');
    expect(CONTINENT_OF['566']).toBe('AF');
    expect(CONTINENT_OF['010']).toBe('AN');
  });

  it('knows only the seven continents', () => {
    const known = new Set(Object.keys(CONTINENT_NAMES));

    for (const continent of Object.values(CONTINENT_OF))
      expect(known.has(continent)).toBe(true);
  });
});
