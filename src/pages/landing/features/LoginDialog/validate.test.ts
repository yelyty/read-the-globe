import { describe, expect, it } from 'vitest';

import { MIN_PASSWORD_LENGTH } from '../../../../auth/forms';
import { m } from '../../../../paraglide/messages.js';
import { validate } from './validate';

const good = {
  name: 'Ada',
  email: 'ada@example.com',
  password: 'a'.repeat(MIN_PASSWORD_LENGTH),
};

const empty = { name: '', email: '', password: '' };

// an absent field and one set to undefined both mean no problem
const problems = (errors: object) =>
  Object.fromEntries(Object.entries(errors).filter(([, value]) => value));

describe('validate', () => {
  it('passes a good form in every mode', () => {
    for (const mode of ['signup', 'login', 'reset'] as const)
      expect(problems(validate(mode, good)), mode).toEqual({});
  });

  it('asks a new reader for a name, an address and a long-enough password', () => {
    expect(validate('signup', empty)).toEqual({
      name: m.auth_name_missing(),
      email: m.auth_email_invalid(),
      password: m.auth_password_short(),
    });
  });

  it('asks a returning reader for an address and any password', () => {
    expect(validate('login', empty)).toEqual({
      email: m.auth_email_invalid(),
      password: m.auth_password_missing(),
    });

    // a password set before the minimum still signs in
    expect(problems(validate('login', { ...good, password: 'x' }))).toEqual({});
  });

  it('asks a reset for nothing but an address', () => {
    expect(validate('reset', empty)).toEqual({
      email: m.auth_email_invalid(),
    });
  });
});
