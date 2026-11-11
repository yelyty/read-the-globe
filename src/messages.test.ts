import { describe, expect, it } from 'vitest';

const files = import.meta.glob<Record<string, unknown>>('../messages/*.json', {
  eager: true,
  import: 'default',
});

// every message is in every language: a key missing from one file would fall back to English there
describe('messages', () => {
  it('has the same keys in en, cs and uk', () => {
    const keys = (name: string) =>
      Object.keys(files[`../messages/${name}.json`]).sort();

    expect(Object.keys(files).length).toBe(3);
    expect(keys('cs')).toEqual(keys('en'));
    expect(keys('uk')).toEqual(keys('en'));
  });
});
