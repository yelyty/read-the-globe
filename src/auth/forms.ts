import { m } from '../paraglide/messages.js';

export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const STRENGTH_LABELS = [
  m.auth_strength_0,
  m.auth_strength_1,
  m.auth_strength_2,
  m.auth_strength_3,
  m.auth_strength_4,
];

export const passwordStrength = (password: string): 0 | 1 | 2 | 3 | 4 => {
  if (password.length < 8) return 0;
  let score = 1;

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
};

/** The rule a new password must meet, as the message to show; null when it's fine. */
export const newPasswordProblem = (password: string) =>
  password.length < 8 ? m.auth_password_short() : null;
