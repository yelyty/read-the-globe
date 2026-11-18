import { describe, expect, it } from 'vitest';

import { idFor } from './idFor';

describe('idFor', () => {
  it('gives the same label the same id every time', () => {
    expect(idFor('Kokoro')).toBe(idFor('Kokoro'));
  });

  it('gives different labels different ids', () => {
    const ids = ['b1', 'b2', 'Kokoro', 'kokoro', ''].map(idFor);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('stays a safe whole number, however long the label', () => {
    const id = idFor('x'.repeat(10_000));

    expect(Number.isSafeInteger(id)).toBe(true);
    expect(id).toBeGreaterThanOrEqual(0);
  });
});
