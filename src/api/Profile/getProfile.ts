import type { Profile } from '../../types';
import { supabase } from '../../utils/supabase';

/** the Postcard page's saved set-up, as stored; the page checks each field before using it */
export type SavedPostcard = Record<string, unknown> | null;

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
