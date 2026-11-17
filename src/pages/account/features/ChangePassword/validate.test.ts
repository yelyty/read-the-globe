import { describe, expect, it } from 'vitest';

import { MIN_PASSWORD_LENGTH } from '../../../../auth/forms';
import { m } from '../../../../paraglide/messages.js';
import { validate } from './validate';

const long = 'a'.repeat(MIN_PASSWORD_LENGTH);

describe('validate', () => {
  it('passes two matching passwords of the minimum length', () => {
    expect(validate(long, long)).toEqual({});
  });

  it('asks for a password when the first is empty', () => {
    expect(validate('', '')).toEqual({ first: m.account_password_missing() });
  });

  it('calls a password one character under the minimum too short', () => {
    const short = long.slice(1);

    expect(validate(short, short)).toEqual({
      first: m.account_password_short(),
    });
  });

  it('reports only the first field while it is wrong, whatever the second says', () => {
    expect(validate('short', 'different')).toEqual({
      first: m.account_password_short(),
    });
  });

  it('asks to repeat the password when the second is empty', () => {
    expect(validate(long, '')).toEqual({
      second: m.account_password_repeat_missing(),
    });
  });

  it('says the passwords differ when the second does not match', () => {
    expect(validate(long, `${long}b`)).toEqual({
      second: m.account_password_mismatch(),
    });
  });
});
