import type { Goal } from "../../types";
import { supabase } from "../../utils/supabase";


type GoalInput = Pick<Goal, "kind" | "name" | "continent" | "countryCodes" | "target">;

const toRow = (goal: GoalInput) => ({
	kind: goal.kind,
	name: goal.name.trim(),
	continent: goal.kind === "region" ? goal.continent : null,
	country_codes: goal.kind === "countries" ? goal.countryCodes : null,
	target: goal.kind === "theme" ? goal.target : null,
});

const message = (error: { code?: string; message: string } | null) =>
	error?.code === "23505" ? "You already have a goal with that name." : (error?.message ?? null);

export async function getGoals(userId: string): Promise<Goal[]> {
	const { data, error } = await supabase
		.from("goals")
		.select("id, kind, name, continent, countryCodes:country_codes, target, reachedOn:reached_on")
		.eq("user_id", userId)
		.order("created_at")
		.returns<Goal[]>();

	if (error) {
		throw new Error("Couldn't load your goals");
	}
	return data ?? [];
}

export async function addGoal(goal: GoalInput): Promise<string | null> {
	const { error } = await supabase.from("goals").insert(toRow(goal));
	return message(error);
}

// ponytail: the dialog locks the kind (REACT-TODO 14.10), so the same row shape works for edits
export async function updateGoal(id: number, goal: GoalInput): Promise<string | null> {
	const { error } = await supabase.from("goals").update(toRow(goal)).eq("id", id);
	return message(error);
}

export async function deleteGoal(id: number): Promise<string | null> {
	const { error } = await supabase.from("goals").delete().eq("id", id);
	return error?.message ?? null;
}

export async function markReached(id: number, date: string | null): Promise<string | null> {
	const { error } = await supabase.from("goals").update({ reached_on: date }).eq("id", id);
	return error?.message ?? null;
}

export async function setGoalBooks(goalId: number, bookIds: string[]): Promise<string | null> {
	const { error } = await supabase.rpc("set_goal_books", { p_goal_id: goalId, p_book_ids: bookIds });
	return error?.message ?? null;
}
