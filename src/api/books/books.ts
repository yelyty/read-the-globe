import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';

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

// the saved book's id, or what went wrong
export async function saveBook(
  draft: BookDraft,
  id?: string
): Promise<{ id?: string; error?: string }> {
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
  return error ? { error: m.book_save_failed() } : { id: saved.data as string };
}

export async function deleteBook(id: string): Promise<string | null> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) console.error(error);
  return error ? m.book_remove_failed() : null;
}
