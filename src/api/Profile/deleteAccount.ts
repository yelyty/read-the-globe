import { supabase } from '../../utils/supabase';
import type { Problem } from '../outcome';

export async function deleteAccount(): Promise<Problem> {
  const { error } = await supabase.rpc('delete_account');

  if (error) {
    return error.message;
  }

  await supabase.auth.signOut();

  return null;
}
