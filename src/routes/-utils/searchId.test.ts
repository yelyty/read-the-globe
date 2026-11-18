import { describe, expect, it } from 'vitest';

import { searchId } from './searchId';

describe('searchId', () => {
  it('keeps the number the router parsed from ?edit=37', () => {
    expect(searchId(37)).toBe(37);
  });

  it('reads an older, quoted ?edit="37" as the same id', () => {
    expect(searchId('37')).toBe(37);
  });

  it('drops anything that is not a whole number', () => {
    expect(searchId(undefined)).toBeUndefined();
    expect(searchId('')).toBeUndefined();
    expect(searchId('a1b2')).toBeUndefined();
    expect(searchId(1.5)).toBeUndefined();
    expect(searchId(true)).toBeUndefined();
  });
});
