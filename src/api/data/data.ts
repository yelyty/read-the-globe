import type { BookEntry, Goal, NextRead, World } from '../../types';
import type { ImportedBook } from '../../utils/readingListCsv';
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
): Promise<Made<{ added: number; duplicates: number }>> {
  if (!books.length) return made({ added: 0, duplicates: 0 });
  const done = await supabase.rpc('import_books', { p_books: books });

  if (done.error) console.error(done.error);

  return done.error
    ? failed(m.data_import_failed())
    : made(done.data as { added: number; duplicates: number });
}

export async function restoreBackup(backup: Backup): Promise<Problem> {
  const { error } = await supabase.rpc('restore_backup', { p_backup: backup });

  if (error) console.error(error);

  return error ? m.data_restore_failed() : null;
}

export async function clearAtlas(): Promise<Problem> {
  const { error } = await supabase.rpc('clear_atlas');

  if (error) console.error(error);

  return error ? m.account_clear_failed() : null;
}

/** Undo for Clear this atlas: the atlas as it was comes back, and anything logged since the clear stays beside it
    (a goal of the same name keeps the one from before). Returns what went wrong, or null. */
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
