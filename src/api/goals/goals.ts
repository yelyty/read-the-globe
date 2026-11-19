import type { Goal } from '../../types';
import { supabase } from '../../utils/supabase';
import { m } from '../../paraglide/messages.js';
import type { Problem } from '../outcome';

type GoalInput = Pick<
  Goal,
  'kind' | 'name' | 'continent' | 'countryCodes' | 'target'
>;

const toRow = (goal: GoalInput) => ({
  kind: goal.kind,
  name: goal.name.trim(),
  continent: goal.kind === 'region' ? goal.continent : null,
  country_codes: goal.kind === 'countries' ? goal.countryCodes : null,
  target: goal.kind === 'theme' ? goal.target : null,
});

const message = (error: { code?: string; message: string } | null) =>
  error?.code === '23505' ? m.goals_err_taken() : (error?.message ?? null);

/**
 * Gets the goals of a reader, oldest first.
 * The function throws an error if the goals cannot be read.
 */
export const getGoals = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select(
      'id, kind, name, continent, countryCodes:country_codes, target, reachedOn:reached_on'
    )
    .eq('user_id', userId)
    .order('created_at')
    .returns<Goal[]>();

  if (error) {
    throw new Error(m.goals_err_load());
  }

  return data ?? [];
};

/**
 * Adds a goal. The goal keeps only the field its kind uses: a continent, countries, or a number of books.
 * @returns Null if the goal was added. If a goal with this name exists, a message that says so. If not, the error message.
 */
export const addGoal = async (goal: GoalInput): Promise<Problem> => {
  const { error } = await supabase.from('goals').insert(toRow(goal));

  return message(error);
};

/**
 * Saves changes to a goal. The goal keeps only the field its kind uses.
 * @returns Null if the goal was saved. If a goal with this name exists, a message that says so. If not, the error message.
 */
export const updateGoal = async (
  id: number,
  goal: GoalInput
): Promise<Problem> => {
  const { error } = await supabase
    .from('goals')
    .update(toRow(goal))
    .eq('id', id);

  return message(error);
};

/**
 * Removes a goal.
 * @returns Null if the goal was removed. If not, the error message.
 */
export const deleteGoal = async (id: number): Promise<Problem> => {
  const { error } = await supabase.from('goals').delete().eq('id', id);

  return error?.message ?? null;
};

/**
 * Marks a goal as reached on a date, or as not reached.
 * @param date - The day the goal was reached, YYYY-MM-DD, or null for not reached.
 * @returns Null if the goal was saved. If not, the error message.
 */
export const markReached = async (
  id: number,
  date: string | null
): Promise<Problem> => {
  const { error } = await supabase
    .from('goals')
    .update({ reached_on: date })
    .eq('id', id);

  return error?.message ?? null;
};

/**
 * Sets the books that count for a goal. The list replaces the books the goal had before.
 * @returns Null if the books were saved. If not, the error message.
 */
export const setGoalBooks = async (
  goalId: number,
  bookIds: number[]
): Promise<Problem> => {
  const { error } = await supabase.rpc('set_goal_books', {
    p_goal_id: goalId,
    p_book_ids: bookIds,
  });

  return error?.message ?? null;
};

/**
 * Brings back a removed goal, with the date it was reached and its books. Undo uses it.
 * @returns Null if the goal came back. If not, the error message.
 */
export const restoreGoal = async (
  goal: Goal,
  bookIds: number[]
): Promise<Problem> => {
  const { data, error } = await supabase
    .from('goals')
    .insert({ ...toRow(goal), reached_on: goal.reachedOn })
    .select('id')
    .single<{ id: number }>();

  if (error) return message(error);

  return bookIds.length ? setGoalBooks(data.id, bookIds) : null;
};
