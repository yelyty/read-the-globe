import { isEmail, newPasswordProblem } from '../../../../auth/forms';
import { m } from '../../../../paraglide/messages.js';

export type AuthMode = 'signup' | 'login' | 'reset';

export type Values = { name: string; email: string; password: string };

export type Errors = Partial<Record<keyof Values, string>>;

export const validate = (mode: AuthMode, values: Values): Errors => {
  const errors: Errors = {};

  if (mode === 'signup' && !values.name.trim())
    errors.name = m.auth_name_missing();
  if (!isEmail(values.email)) errors.email = m.auth_email_invalid();
  if (mode === 'signup')
    errors.password = newPasswordProblem(values.password) ?? undefined;
  if (mode === 'login' && !values.password)
    errors.password = m.auth_password_missing();

  return errors;
};
