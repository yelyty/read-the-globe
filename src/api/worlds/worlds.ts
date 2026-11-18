import type { World } from '../../types';
import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import type { Problem } from '../outcome';

/**
 * Gets the imagined worlds that a reader saved from Beyond the map.
 * If the worlds cannot be read, the function gives an empty list.
 */
export const getWorlds = async (userId: string): Promise<World[]> => {
  const { data, error } = await supabase
    .from('worlds')
    .select('id, name')
    .eq('user_id', userId)
    .order('created_at')
    .returns<World[]>();

  if (error) console.error(error);

  return data ?? [];
};

/**
 * Saves an imagined world.
 * @returns Null if the world was saved. If not, a message that it could not be saved.
 */
export const addWorld = async (name: string): Promise<Problem> => {
  const { error } = await supabase.from('worlds').insert({ name });

  if (error) console.error(error);

  return error ? m.world_save_failed() : null;
};

/**
 * Removes a saved imagined world.
 * @returns Null if the world was removed. If not, a message that it could not be removed.
 */
export const removeWorld = async (id: string): Promise<Problem> => {
  const { error } = await supabase.from('worlds').delete().eq('id', id);

  if (error) console.error(error);

  return error ? m.world_remove_failed() : null;
};
