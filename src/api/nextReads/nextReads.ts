import type { NextRead } from '../../types';
import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import { failed, made, type Made, type Problem } from '../outcome';

const FIELDS =
  'id, title, author, countryCode:country_code, mark, createdAt:created_at';

/**
 * Gets the next reads of a reader, newest first.
 * If the list cannot be read, the function gives an empty list, so the rest of the Shelf page still shows.
 * @returns The list, and `failed: true` if it could not be read.
 */
export async function getNextReads(
  userId: string
): Promise<{ items: NextRead[]; failed: boolean }> {
  const { data, error } = await supabase
    .from('next_reads')
    .select(FIELDS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<NextRead[]>();

  if (error) console.error(error);

  return { items: data ?? [], failed: !!error };
}

/**
 * Adds a book to the next reads.
 * @returns The new next read, or a message that it could not be saved.
 */
export async function addNextRead(
  item: Pick<NextRead, 'title' | 'author' | 'countryCode' | 'mark'>
): Promise<Made<NextRead>> {
  const { data, error } = await supabase
    .from('next_reads')
    .insert({
      title: item.title,
      author: item.author,
      country_code: item.countryCode,
      mark: item.mark,
    })
    .select(FIELDS)
    .single<NextRead>();

  if (error) console.error(error);

  return data ? made(data) : failed(m.next_save_failed());
}

/**
 * Removes a book from the next reads.
 * @returns Null if it was removed. If not, a message with the title of the book.
 */
export async function removeNextRead(
  item: Pick<NextRead, 'id' | 'title'>
): Promise<Problem> {
  const { error } = await supabase
    .from('next_reads')
    .delete()
    .eq('id', item.id);

  if (error) console.error(error);

  return error ? m.next_remove_failed({ title: item.title }) : null;
}
