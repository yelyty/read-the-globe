import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import { failed, made, type Made, type Problem } from '../outcome';

export type BookDraft = {
  title: string;
  author: string;
  authorCountry: string;
  /** when it was read, YYYY-MM-DD; null keeps the book's date (today for a new one) */
  readOn: string | null;
  /** an imagined place has a name (its world) and no country */
  places: { name: string; country: string | null; imagined?: boolean }[];
  goalIds: number[];
};

export async function saveBook(
  draft: BookDraft,
  id?: string
): Promise<Made<string>> {
  const saved = await supabase.rpc('save_book', {
    p_book_id: id ?? null,
    p_title: draft.title,
    p_author: draft.author,
    p_author_country: draft.authorCountry,
    p_read_on: draft.readOn,
    p_places: draft.places,
    p_goal_ids: draft.goalIds,
  });

  const { error } = saved;

  if (error) console.error(error);

  return error ? failed(m.book_save_failed()) : made(saved.data as string);
}

export async function deleteBook(id: string): Promise<Problem> {
  const { error } = await supabase.from('books').delete().eq('id', id);

  if (error) console.error(error);

  return error ? m.book_remove_failed() : null;
}
