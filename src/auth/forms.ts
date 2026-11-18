import { m } from '../paraglide/messages.js';

/**
 * Checks if a value looks like an email address. Spaces at the start and the end are ignored.
 */
export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** the shortest password the app accepts */
export const MIN_PASSWORD_LENGTH = 8;

export const STRENGTH_LABELS = [
  m.auth_strength_0,
  m.auth_strength_1,
  m.auth_strength_2,
  m.auth_strength_3,
  m.auth_strength_4,
];

// 0 is too short; each kind of character mix adds a point, up to the last label
export const MAX_STRENGTH = STRENGTH_LABELS.length - 1;

/** an index into STRENGTH_LABELS */
export type Strength = 0 | 1 | 2 | 3 | 4;

/**
 * Gets the strength of a password, from 0 to 4.
 * A password under the minimum length is 0. A longer password is 1, plus 1 each for mixed case, a digit, and a symbol.
 * @returns An index into STRENGTH_LABELS.
 */
export const passwordStrength = (password: string): Strength => {
  if (password.length < MIN_PASSWORD_LENGTH) return 0;
  let score = 1;

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(MAX_STRENGTH, score) as Strength;
};

/** The rule a new password must meet, as the message to show; null when it's fine. */
export const newPasswordProblem = (password: string) =>
  password.length < MIN_PASSWORD_LENGTH ? m.auth_password_short() : null;
