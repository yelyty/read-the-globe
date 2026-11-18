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

/**
 * Saves a book with its places and goals, in one call.
 * @param id - The id of the book to edit. Without it, the function adds a new book.
 * @returns The id of the saved book, or a message that the book could not be saved.
 */
export async function saveBook(
  draft: BookDraft,
  id?: number
): Promise<Made<number>> {
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

  return error ? failed(m.book_save_failed()) : made(saved.data as number);
}

/**
 * Removes a book from the shelf.
 * @returns Null if the book was removed. If not, a message that it could not be removed.
 */
export async function deleteBook(id: number): Promise<Problem> {
  const { error } = await supabase.from('books').delete().eq('id', id);

  if (error) console.error(error);

  return error ? m.book_remove_failed() : null;
}
