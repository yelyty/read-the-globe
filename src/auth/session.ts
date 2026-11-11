import type { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

export interface Reader {
  id: string;
  email: string | null;
  signUpName: string | null;
  createdAt: string;
}

export const toReader = (user: User): Reader => ({
  id: user.id,
  email: user.email ?? null,
  signUpName:
    typeof user.user_metadata?.display_name === 'string'
      ? user.user_metadata.display_name
      : null,
  createdAt: user.created_at,
});

// The wish for example books rides in user metadata, so it survives email confirmation;
// it is cleared once the atlas is seeded, and seed_example_atlas() itself skips a reader who already has books.
const SEED_FLAG = 'seed_example';
let seeding: Promise<void> | undefined;

export type AuthProblem = 'wrong-credentials' | 'email-taken' | 'failed';

export async function signIn(
  email: string,
  password: string
): Promise<AuthProblem | null> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) return null;
    return error.code === 'invalid_credentials'
      ? 'wrong-credentials'
      : 'failed';
  } catch {
    return 'failed';
  }
}

export async function signUp(details: {
  email: string;
  password: string;
  name: string;
  /** fill the new atlas with example books, now or on the first sign-in after confirming the email */
  example: boolean;
}): Promise<{ problem: AuthProblem | null; confirmEmail: boolean }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: details.email,
      password: details.password,
      options: {
        data: {
          display_name: details.name,
          ...(details.example && { [SEED_FLAG]: true }),
        },
      },
    });
    if (error) {
      const taken =
        error.code === 'user_already_exists' || error.code === 'email_exists';
      return { problem: taken ? 'email-taken' : 'failed', confirmEmail: false };
    }
    return { problem: null, confirmEmail: !data.session };
  } catch {
    return { problem: 'failed', confirmEmail: false };
  }
}

export function seedIfWished(user: User): Promise<void> {
  if (user.user_metadata?.[SEED_FLAG] !== true) return Promise.resolve();
  seeding ??= (async () => {
    const { error } = await supabase.rpc('seed_example_atlas');
    if (error) console.error(error);
    else await supabase.auth.updateUser({ data: { [SEED_FLAG]: null } });
  })().finally(() => (seeding = undefined));
  return seeding;
}

// Always the same neutral answer, so the form never tells whether an email has an account.
export async function sendPasswordReset(email: string): Promise<boolean> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) console.error(error);
  return !error || error.code === 'user_not_found';
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function updateDisplayName(name: string): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({
    data: { display_name: name },
  });
  return error ? "Couldn't save your name. Try again" : null;
}

export async function changePassword(password: string): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({ password });

  if (!error) return null;
  if (error.code === 'same_password')
    return "That's your current password. Choose a new one.";
  if (error.code === 'weak_password')
    return 'Choose a stronger password: at least 8 characters.';
  if (error.code === 'reauthentication_needed')
    return 'For your safety, sign out and in again, then change your password.';

  return "Couldn't change your password. Try again.";
}
