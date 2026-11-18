import type { Profile } from '../../types';
import { supabase } from '../../utils/supabase';

/** the Postcard page's saved set-up, as stored; the page checks each field before using it */
export type SavedPostcard = Record<string, unknown> | null;

/**
 * Gets the profile of a reader: the display name, the handle, the date the account was made, and the saved Postcard set-up.
 * @returns The profile, or null if the reader has no profile or the profile cannot be read.
 */
export async function getProfile(
  userId: string
): Promise<(Profile & { postcard: SavedPostcard }) | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('displayName:display_name, handle, createdAt: created_at, postcard')
    .eq('id', userId)
    .maybeSingle<Profile & { postcard: SavedPostcard }>();

  if (error) console.error(error);

  return data;
}
