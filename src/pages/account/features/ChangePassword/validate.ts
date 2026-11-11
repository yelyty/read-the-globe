import { m } from '../../../../paraglide/messages.js';

export type Errors = { first?: string; second?: string };

export const validate = (first: string, second: string): Errors => {
  if (first.length < 8)
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
