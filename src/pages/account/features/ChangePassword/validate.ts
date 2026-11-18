import { MIN_PASSWORD_LENGTH } from '../../../../auth/forms';
import { m } from '../../../../paraglide/messages.js';

export type Errors = { first?: string; second?: string };

/**
 * Checks the two password fields of the Change password form.
 * The function returns only one error at a time. It checks the first field before the second field.
 * @param first - The new password.
 * @param second - The new password again.
 * @returns An empty object if the passwords are correct. If not, the error message for the incorrect field.
 */
export const validate = (first: string, second: string): Errors => {
  if (first.length < MIN_PASSWORD_LENGTH)
    return {
      first: first ? m.account_password_short() : m.account_password_missing(),
    };
  if (second !== first)
    return {
      second: second
        ? m.account_password_mismatch()
        : m.account_password_repeat_missing(),
    };

  return {};
};
