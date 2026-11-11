import type { BookEntry, Goal, NextRead, World } from '../../types';
import type { ImportedBook } from '../../utils/readingListCsv';
import { supabase } from '../../utils/supabase';
import getBooks from '../getBooks';
import { getGoals } from '../goals/goals';
import { getNextReads } from '../nextReads/nextReads';
import { getWorlds } from '../worlds/worlds';

// The whole atlas as the Full backup (JSON) writes it, and as restore_backup reads it back
export type Backup = {
  exported: string;
  books: BookEntry[];
  goals: Goal[];
  /** missing from backups made before step 4: restoring one leaves no next reads or saved worlds */
  nextReads?: NextRead[];
  worlds?: World[];
};

// throws when any part can't be read, so nothing is cleared or replaced on a partial copy
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

// a reading list in, all or nothing; books already on the shelf (same title and author) are skipped
export async function importBooks(
  books: ImportedBook[]
): Promise<{ added: number; duplicates: number } | { error: string }> {
  if (!books.length) return { added: 0, duplicates: 0 };
  const done = await supabase.rpc('import_books', { p_books: books });
  if (done.error) console.error(done.error);
  return done.error
    ? {
        error:
          'That reading list couldn’t be imported. Nothing was added. Try again.',
      }
    : (done.data as { added: number; duplicates: number });
}

export async function restoreBackup(backup: Backup): Promise<string | null> {
  const { error } = await supabase.rpc('restore_backup', { p_backup: backup });
  if (error) console.error(error);
  return error
    ? 'That backup couldn’t be restored. Your atlas is unchanged.'
    : null;
}

export async function clearAtlas(): Promise<string | null> {
  const { error } = await supabase.rpc('clear_atlas');
  if (error) console.error(error);
  return error ? 'Your atlas couldn’t be cleared. Try again.' : null;
}
