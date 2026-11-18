import type { Profile } from '../../types';
import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import type { Problem } from '../outcome';

/** the Postcard page's saved set-up, as stored; the page checks each field before using it */
export type SavedPostcard = Record<string, unknown> | null;

/**
 * Gets the profile of a reader: the display name, the handle, the date the account was made, and the saved Postcard set-up.
 * @returns The profile, or null if the reader has no profile or the profile cannot be read.
 */
export const getProfile = async (
  userId: string
): Promise<(Profile & { postcard: SavedPostcard }) | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('displayName:display_name, handle, createdAt: created_at, postcard')
    .eq('id', userId)
    .maybeSingle<Profile & { postcard: SavedPostcard }>();

  if (error) console.error(error);

  return data;
};

/**
 * Saves changes to the profile of a reader.
 * The function writes only the fields in `changes`, so the Postcard page can save its set-up without changing the name.
 * @returns Null if the changes were saved. If the handle is already taken, a message that says so. If not, the error message.
 */
export const updateProfile = async (
  userId: string,
  changes: Partial<Pick<Profile, 'displayName' | 'handle'>> & {
    postcard?: object;
  }
): Promise<Problem> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...(changes.displayName !== undefined && {
        display_name: changes.displayName,
      }),
      ...(changes.handle !== undefined && { handle: changes.handle }),
      ...(changes.postcard !== undefined && { postcard: changes.postcard }),
    })
    .eq('id', userId);

  if (error?.code === '23505') return m.account_handle_taken();

  return error?.message ?? null;
};

/** the language saved on the account, or null when it has none yet; throws when it can't be read */
export const getAccountLang = async (
  userId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('lang')
    .eq('id', userId)
    .maybeSingle<{ lang: string | null }>();

  if (error) throw error;

  return data?.lang ?? null;
};

/** saves the language on the account: the one given, or the signed-in reader's; signed out, nothing to save */
export const saveAccountLang = async (
  lang: string,
  userId?: string
): Promise<Problem> => {
  const id = userId ?? (await supabase.auth.getSession()).data.session?.user.id;

  if (!id) return null;

  const { error } = await supabase
    .from('profiles')
    .update({ lang })
    .eq('id', id);

  return error?.message ?? null;
};

/**
 * Deletes the account of the reader, with all of its data, and then signs the reader out.
 * @returns Null if the account was deleted. If not, the error message, and the reader stays signed in.
 */
export const deleteAccount = async (): Promise<Problem> => {
  const { error } = await supabase.rpc('delete_account');

  if (error) {
    return error.message;
  }

  await supabase.auth.signOut();

  return null;
};
