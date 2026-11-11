import { describe, expect, it } from 'vitest';
import { atlasAfter, BOOKS } from './miraAtlas';

describe('atlasAfter', () => {
  it('starts empty', () => {
    expect(atlasAfter(0).countries).toBe(0);
  });

  it('counts a country marked twice once', () => {
    // The Master and Margarita: by a Russian author, set in Russia
    const first = atlasAfter(1);

    expect(first.set).toEqual(new Set(['643']));
    expect(first.author).toEqual(new Set(['643']));
    expect(first.countries).toBe(1);
  });

  it('ends at the 44 countries the landing promises', () => {
    expect(BOOKS).toHaveLength(48);
    expect(atlasAfter(BOOKS.length).countries).toBe(44);
  });
});
