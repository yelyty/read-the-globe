import type { User } from '@supabase/supabase-js';

import { supabase } from '../utils/supabase';
import { adoptAccountLang } from '../utils/lang';
import { m } from '../paraglide/messages.js';
import type { Problem } from '../api/outcome';

export type Reader = {
  id: string;
  email: string | null;
  signUpName: string | null;
  createdAt: string;
};

/**
 * Gets the reader from a Supabase user: the id, the email, the name given at sign-up, and the date the account was made.
 */
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

/**
 * Signs a reader in with an email and a password, and then uses the language saved on the account.
 * @returns Null if the reader is signed in. If not, 'wrong-credentials' or 'failed'.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthProblem | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // the account's language: a reader who picked Czech on another device gets Czech here too
    if (!error) {
      await adoptAccountLang(data.user.id).catch(() => false);

      return null;
    }

    return error.code === 'invalid_credentials'
      ? 'wrong-credentials'
      : 'failed';
  } catch {
    return 'failed';
  }
};

/**
 * Makes a new account. The confirmation email links back to the app.
 * @param details - The email, the password, the name, and if the new atlas gets example books.
 * @returns The problem, if any, and if the reader must confirm the email before signing in.
 */
export const signUp = async (details: {
  email: string;
  password: string;
  name: string;
  /** fill the new atlas with example books, now or on the first sign-in after confirming the email */
  example: boolean;
}): Promise<{ problem: AuthProblem | null; confirmEmail: boolean }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: details.email,
      password: details.password,
      options: {
        // without it the confirmation link goes to the project's Site URL, not to where the reader signed up
        emailRedirectTo: window.location.origin,
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
};

/**
 * Adds the example books to the atlas, if the reader asked for them at sign-up. Then the wish is removed.
 * If the function is called again while it runs, it does not add the books again.
 */
export const seedIfWished = (user: User): Promise<void> => {
  if (user.user_metadata?.[SEED_FLAG] !== true) return Promise.resolve();

  seeding ??= (async () => {
    const { error } = await supabase.rpc('seed_example_atlas');

    if (error) console.error(error);
    else await supabase.auth.updateUser({ data: { [SEED_FLAG]: null } });
  })().finally(() => (seeding = undefined));

  return seeding;
};

/**
 * Sends an email with a link to reset the password.
 * The answer is the same if the email has no account, so the form never tells who has an account.
 * @returns Null, or a message to try again.
 */
export const sendPasswordReset = async (email: string): Promise<Problem> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) console.error(error);

  return !error || error.code === 'user_not_found'
    ? null
    : m.common_try_again();
};

/**
 * Signs the reader out.
 */
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

/**
 * Saves the name of the reader.
 * @returns Null if the name was saved. If not, a message that it could not be saved.
 */
export const updateDisplayName = async (name: string): Promise<Problem> => {
  const { error } = await supabase.auth.updateUser({
    data: { display_name: name },
  });

  return error ? m.auth_name_save_failed() : null;
};

/**
 * Changes the password of the reader.
 * @returns Null if the password was changed. If not, a message that tells why, in the reader's words.
 */
export const changePassword = async (password: string): Promise<Problem> => {
  const { error } = await supabase.auth.updateUser({ password });

  if (!error) return null;
  if (error.code === 'same_password') return m.auth_same_password();
  if (error.code === 'weak_password') return m.auth_weak_password();
  if (error.code === 'reauthentication_needed') return m.auth_reauth_needed();

  return m.auth_change_failed();
};
