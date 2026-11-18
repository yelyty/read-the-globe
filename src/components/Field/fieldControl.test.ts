import { describe, expect, it } from 'vitest';

import { joinClass } from './fieldControl';

describe('joinClass', () => {
  it('puts a control’s own class after the field’s', () => {
    expect(joinClass('field', 'own')).toBe('field own');
  });

  it('skips the classes that aren’t there', () => {
    expect(joinClass('field', false, null, undefined, '', 'own')).toBe(
      'field own'
    );
  });

  it('gives no class at all when none are there', () => {
    expect(joinClass()).toBeUndefined();
    expect(joinClass(false, null, '')).toBeUndefined();
  });
});
