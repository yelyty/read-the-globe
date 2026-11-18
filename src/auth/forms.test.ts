import { describe, expect, it } from 'vitest';

import { m } from '../paraglide/messages.js';
import {
  isEmail,
  MAX_STRENGTH,
  MIN_PASSWORD_LENGTH,
  newPasswordProblem,
  passwordStrength,
  STRENGTH_LABELS,
} from './forms';

describe('isEmail', () => {
  it('takes an ordinary address', () => {
    expect(isEmail('reader@example.com')).toBe(true);
  });

  it('ignores spaces around it', () => {
    expect(isEmail('  reader@example.com ')).toBe(true);
  });

  it('turns down what isn’t an address', () => {
    for (const value of [
      '',
      'reader',
      'reader@',
      '@example.com',
      'reader@example',
      'read er@example.com',
      'reader@@example.com',
    ])
      expect(isEmail(value), value).toBe(false);
  });
});

describe('passwordStrength', () => {
  const pad = (start: string) => start.padEnd(MIN_PASSWORD_LENGTH, 'a');

  it('gives 0 to a password under the minimum, whatever it holds', () => {
    expect(passwordStrength('Aa1!')).toBe(0);
    expect(passwordStrength('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toBe(0);
  });

  it('gives 1 to a long-enough password of one kind of letter', () => {
    expect(passwordStrength('a'.repeat(MIN_PASSWORD_LENGTH))).toBe(1);
  });

  it('adds a point each for mixed case, a digit and a symbol', () => {
    expect(passwordStrength(pad('A'))).toBe(2);
    expect(passwordStrength(pad('A1'))).toBe(3);
    expect(passwordStrength(pad('A1!'))).toBe(MAX_STRENGTH);
  });

  it('counts a digit or a symbol without mixed case', () => {
    expect(passwordStrength(pad('1'))).toBe(2);
    expect(passwordStrength(pad('!'))).toBe(2);
  });

  it('has a label for every strength', () => {
    expect(STRENGTH_LABELS).toHaveLength(MAX_STRENGTH + 1);
  });
});

describe('newPasswordProblem', () => {
  it('calls a password under the minimum too short', () => {
    expect(newPasswordProblem('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toBe(
      m.auth_password_short()
    );
  });

  it('has nothing against one of the minimum length', () => {
    expect(newPasswordProblem('a'.repeat(MIN_PASSWORD_LENGTH))).toBeNull();
  });
});
