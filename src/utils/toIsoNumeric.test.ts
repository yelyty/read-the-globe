import { describe, expect, it } from 'vitest';

import { toAlpha2, toNumeric } from './toIsoNumeric';

describe('toNumeric', () => {
  it('turns a two-letter code into its numeric code, in either case', () => {
    expect(toNumeric('PT')).toBe('620');
    expect(toNumeric('pt')).toBe('620');
  });

  it('keeps the leading zeros', () => {
    expect(toNumeric('AF')).toBe('004');
  });

  it('gives null for an unknown or missing code', () => {
    expect(toNumeric('XX')).toBeNull();
    expect(toNumeric('')).toBeNull();
    expect(toNumeric(null)).toBeNull();
    expect(toNumeric(undefined)).toBeNull();
  });
});

describe('toAlpha2', () => {
  it('turns a numeric code back into its two letters', () => {
    expect(toAlpha2('620')).toBe('PT');
    expect(toAlpha2('004')).toBe('AF');
  });

  it('gives null for an unknown code', () => {
    expect(toAlpha2('999')).toBeNull();
  });

  it('goes back and forth without losing anything', () => {
    for (const code of ['JP', 'BR', 'ZA', 'NO', 'NZ'])
      expect(toAlpha2(toNumeric(code)!)).toBe(code);
  });
});
