import type { World } from '../../types';
import { supabase } from '../../utils/supabase';

// Imagined worlds saved by hand from Home's "Beyond the map"; the rest come from the books' imagined places.
export async function getWorlds(userId: string): Promise<World[]> {
  const { data, error } = await supabase
    .from('worlds')
    .select('id, name')
    .eq('user_id', userId)
    .order('created_at')
    .returns<World[]>();
  // ponytail: a missing worlds table (app-2-atlas.sql not run yet) just means no saved worlds
  if (error) console.error(error);
  return data ?? [];
}

export async function addWorld(name: string): Promise<string | null> {
  const { error } = await supabase.from('worlds').insert({ name });
  if (error) console.error(error);
  return error ? 'That world couldn’t be saved. Try again.' : null;
}

export async function removeWorld(id: string): Promise<string | null> {
  const { error } = await supabase.from('worlds').delete().eq('id', id);
  if (error) console.error(error);
  return error ? 'That world couldn’t be removed. Try again.' : null;
}
