import type { Feature } from "geojson";
import type { BookEntry, Goal, GoalKind } from "../../types";
import type { Marks } from "../../utils/atlasMarks";
import {
	CONTINENT_NAMES,
	CONTINENT_OF,
	type Continent,
} from "../../utils/continents";
import { toNumeric } from "../../utils/toIsoNumeric";

export const MAX_GOALS = 10;

export const REGIONS = (Object.keys(CONTINENT_NAMES) as Continent[]).filter(
	(c) => c !== "AN",
);

export type GoalDraft = Pick<
	Goal,
	"kind" | "name" | "continent" | "countryCodes" | "target"
>;

const draft = (
	kind: GoalKind,
	name: string,
	extra: Partial<GoalDraft>,
): GoalDraft => ({
	kind,
	name,
	continent: null,
	countryCodes: null,
	target: null,
	...extra,
});
const codes = (alpha2: string) => alpha2.split(" ").map((c) => toNumeric(c)!);

export const CATALOGUE: GoalDraft[] = [
	draft("region", "Around South America", { continent: "SA" }),
	draft("region", "Across Africa", { continent: "AF" }),
	draft("region", "All of Asia", { continent: "AS" }),
	draft("region", "Every corner of Europe", { continent: "EU" }),
	draft("region", "Oceania, island by island", { continent: "OC" }),
	draft("countries", "Island nations", {
		countryCodes: codes(
			"is jp nz lk mg cu ph id ie mt cy fj mv jm bs mu sc ws to tt",
		),
	}),
	draft("countries", "The Silk Road", {
		countryCodes: codes("cn kg kz uz tm tj af ir iq sy tr"),
	}),
	draft("countries", "The Nordics", { countryCodes: codes("is no se fi dk") }),
	draft("countries", "Along the Nile", {
		countryCodes: codes("eg sd ss et ug"),
	}),
	draft("theme", "Stories set in the Arctic", { target: 5 }),
	draft("theme", "Books in translation", { target: 12 }),
	draft("theme", "Written before 1900", { target: 6 }),
];

export const KIND_GROUP: Record<GoalKind, string> = {
	region: "Regions",
	countries: "Sets of countries",
	theme: "Themes",
};

export type Progress = {
	done: number;
	total: number;
	all: string[];
	reached: string[];
};

export function goalProgress(
	goal: GoalDraft & { id?: number },
	marks: Marks,
	books: BookEntry[],
	shapes: Record<string, Feature>,
): Progress {
	if (goal.kind === "theme") {
		const done = books.filter((b) =>
			b.goals?.some((g) => g.goalId === goal.id),
		).length;
		return { done, total: goal.target ?? 1, all: [], reached: [] };
	}
	const all =
		goal.kind === "region"
			? Object.keys(shapes).filter((c) => CONTINENT_OF[c] === goal.continent)
			: (goal.countryCodes ?? []);
	const reached = all.filter((c) => marks[c]);
	return { done: reached.length, total: all.length, all, reached };
}

export const isDone = (p: Progress) => p.total > 0 && p.done >= p.total;

export const plural = (n: number, one: string, many = `${one}s`) =>
	`${n} ${n === 1 ? one : many}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const goalHas = (goal: Goal, code: string) =>
	goal.kind === "region"
		? CONTINENT_OF[code] === goal.continent
		: goal.kind === "countries" && !!goal.countryCodes?.includes(code);
