import { describe, expect, it } from 'vitest';

import { firstName } from './firstName';

describe('firstName', () => {
  it('takes the first word', () => {
    expect(firstName('  Anna  van Dijk ')).toBe('Anna');
  });

  it('is empty without a name', () => {
    expect(firstName(undefined)).toBe('');
    expect(firstName(null)).toBe('');
    expect(firstName('   ')).toBe('');
  });
});
