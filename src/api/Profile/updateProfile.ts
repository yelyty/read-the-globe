import type { Profile } from '../../types';
import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import type { Problem } from '../outcome';

/**
 * Saves changes to the profile of a reader.
 * The function writes only the fields in `changes`, so the Postcard page can save its set-up without changing the name.
 * @returns Null if the changes were saved. If the handle is already taken, a message that says so. If not, the error message.
 */
export async function updateProfile(
  userId: string,
  changes: Partial<Pick<Profile, 'displayName' | 'handle'>> & {
    postcard?: object;
  }
): Promise<Problem> {
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
}
