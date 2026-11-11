import type { Profile } from '../../types';
import { supabase } from '../../utils/supabase';

// only the fields given are written, so the Postcard page can save its set-up without touching the name
export async function updateProfile(
  userId: string,
  changes: Partial<Pick<Profile, 'displayName' | 'handle'>> & {
    postcard?: object;
  }
): Promise<string | null> {
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

  if (error?.code === '23505') return 'That handle is taken. Try another.';
  return error?.message ?? null;
}
