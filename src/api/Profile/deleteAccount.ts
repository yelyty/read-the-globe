import { supabase } from '../../utils/supabase';
import type { Problem } from '../outcome';

/**
 * Deletes the account of the reader, with all of its data, and then signs the reader out.
 * @returns Null if the account was deleted. If not, the error message, and the reader stays signed in.
 */
export async function deleteAccount(): Promise<Problem> {
  const { error } = await supabase.rpc('delete_account');

  if (error) {
    return error.message;
  }

  await supabase.auth.signOut();

  return null;
}
