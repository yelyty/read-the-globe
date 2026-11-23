import { describe, expect, it } from 'vitest';

import { atlasAfter, BOOKS } from './exampleAtlas';

describe('atlasAfter', () => {
  it('starts empty', () => {
    expect(atlasAfter(0).countries).toBe(0);
  });

  it('counts a country marked twice once', () => {
    // Satantango: by a Hungarian author, set in Hungary
    const first = atlasAfter(1);

    expect(first.set).toEqual(new Set(['348']));
    expect(first.author).toEqual(new Set(['348']));
    expect(first.countries).toBe(1);
  });

  it('ends at the 44 countries the landing promises', () => {
    expect(BOOKS).toHaveLength(48);
    expect(atlasAfter(BOOKS.length).countries).toBe(44);
  });
});
