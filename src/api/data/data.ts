import type {
  BookEntry,
  Goal,
  ImportedBook,
  NextRead,
  World,
} from '../../types';
import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import getBooks from '../getBooks';
import { getGoals } from '../goals/goals';
import { getNextReads } from '../nextReads/nextReads';
import { getWorlds } from '../worlds/worlds';
import { failed, made, type Made, type Problem } from '../outcome';

// The whole atlas as the Full backup (JSON) writes it, and as restore_backup reads it back
export type Backup = {
  exported: string;
  books: BookEntry[];
  goals: Goal[];
  /** missing from backups made before step 4: restoring one leaves no next reads or saved worlds */
  nextReads?: NextRead[];
  worlds?: World[];
};

/**
 * Gets a full copy of the atlas: the books, goals, next reads, and saved worlds.
 * The function throws an error if it cannot read one of the parts, so a partial copy is never used.
 */
export async function getBackup(userId: string): Promise<Backup> {
  const [books, goals, next, worlds] = await Promise.all([
    getBooks(userId),
    getGoals(userId),
    getNextReads(userId),
    getWorlds(userId),
  ]);

  if (next.failed) throw new Error("Couldn't load your next reads");

  return {
    exported: new Date().toISOString(),
    books,
    goals,
    nextReads: next.items,
    worlds,
  };
}

/**
 * Adds the books of a reading list to the shelf. The import adds all the books or none of them.
 * The import skips books that are already on the shelf, with the same title and author.
 * @returns The number of books added and the number skipped, or a message that the import failed.
 */
export async function importBooks(
  books: ImportedBook[]
): Promise<Made<{ added: number; duplicates: number }>> {
  if (!books.length) return made({ added: 0, duplicates: 0 });
  const done = await supabase.rpc('import_books', { p_books: books });

  if (done.error) console.error(done.error);

  return done.error
    ? failed(m.data_import_failed())
    : made(done.data as { added: number; duplicates: number });
}

/**
 * Replaces the atlas with a backup.
 * @returns Null if the backup was restored. If not, a message that it could not be restored.
 */
export async function restoreBackup(backup: Backup): Promise<Problem> {
  const { error } = await supabase.rpc('restore_backup', { p_backup: backup });

  if (error) console.error(error);

  return error ? m.data_restore_failed() : null;
}

/**
 * Removes the books, goals, next reads, and saved worlds. The account stays.
 * @returns Null if the atlas was cleared. If not, a message that it could not be cleared.
 */
export async function clearAtlas(): Promise<Problem> {
  const { error } = await supabase.rpc('clear_atlas');

  if (error) console.error(error);

  return error ? m.account_clear_failed() : null;
}

/**
 * Undoes Clear this atlas. The atlas comes back as it was, and anything logged since the clear stays.
 * If a goal from before has the same name as a new goal, the function keeps the goal from before.
 * @param was - The atlas before the clear.
 * @returns Null if the atlas was restored. If not, a message that it could not be restored.
 */
export async function restoreCleared(
  was: Backup,
  userId: string
): Promise<Problem> {
  const since = await getBackup(userId).catch(() => null);

  if (!since) return m.data_restore_failed();
  const taken = new Set(was.goals.map((goal) => goal.name.toLowerCase()));

  return restoreBackup({
    ...was,
    books: [...since.books, ...was.books],
    goals: [
      ...was.goals,
      ...since.goals.filter((goal) => !taken.has(goal.name.toLowerCase())),
    ],
    nextReads: [...(since.nextReads ?? []), ...(was.nextReads ?? [])],
    worlds: [...(was.worlds ?? []), ...(since.worlds ?? [])],
  });
}
