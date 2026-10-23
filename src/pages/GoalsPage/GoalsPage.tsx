import { useEffect, useState } from "react";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { PlusIcon } from "@phosphor-icons/react";
import type { Feature } from "geojson";
import type { Goal, GoalKind } from "../../types";
import { addGoal, deleteGoal, markReached } from "../../api/goals/goals";
import { atlasMarks } from "../../utils/atlasMarks";
import { worldShapes } from "../../utils/worldShapes";
import {
  CATALOGUE,
  KIND_GROUP,
  MAX_GOALS,
  goalProgress,
  isDone,
  plural,
  today,
  type GoalDraft,
} from "./goals";
import { GoalPlate, GoalShelf } from "./GoalPlate";
import GoalRow from "./GoalRow";
import GoalDialog from "./GoalsDialog";
import BooksDialog from "./BooksDialog";
import * as s from "./GoalsPage.css";

const app = getRouteApi("/app");

// Goals, as in the app mock: your goals (still on the road first, reached ones below), then suggestions
// to aim somewhere new, Make your own, and the two dialogs. With no goals, the suggestions are the way in.
const GoalsPage = () => {
  const { books, goals } = app.useLoaderData();
  const router = useRouter();
  const [shapes, setShapes] = useState<Record<string, Feature>>();
  const [editing, setEditing] = useState<Goal | "new" | null>(null);
  const [choosing, setChoosing] = useState<Goal | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    worldShapes().then(setShapes);
  }, []);

  const marks = atlasMarks(books);
  const progress = (g: GoalDraft & { id?: number }) =>
    goalProgress(g, marks, books, shapes ?? {});

  // a goal is stamped reached the first time it is seen full, and loses the stamp if a book is removed
  useEffect(() => {
    if (!shapes) return;
    const changes = goals
      .map((g) => ({
        g,
        done: isDone(goalProgress(g, atlasMarks(books), books, shapes)),
      }))
      .filter(({ g, done }) => done !== !!g.reachedOn);
    if (!changes.length) return;
    Promise.all(
      changes.map(({ g, done }) => markReached(g.id, done ? today() : null)),
    ).then((problems) => {
      if (problems.every((p) => !p)) router.invalidate();
    });
  }, [goals, books, shapes, router]);

  if (!shapes) return <div className={s.page} />;

  const names = Object.fromEntries(
    Object.entries(shapes)
      .filter(([, f]) => f.properties?.name)
      .map(([code, f]) => [code, f.properties!.name as string]),
  );
  const name = (code: string) => names[code] ?? code;
  const full = goals.length >= MAX_GOALS;
  const sorted = [
    ...goals.filter((g) => !isDone(progress(g))),
    ...goals.filter((g) => isDone(progress(g))),
  ];
  const nReached =
    goals.length - goals.filter((g) => !isDone(progress(g))).length;

  const saved = async (message: string) => {
    setStatus(message);
    await router.invalidate();
  };

  const add = async (draft: GoalDraft) => {
    if (full) return;
    const problem = await addGoal(draft);
    if (problem) return setStatus(problem);
    saved(`Goal added: ${draft.name}.`);
  };

  const remove = async (goal: Goal) => {
    // ponytail: confirm() until the app has a status line with Undo (REACT-TODO 5.1)
    if (!window.confirm(`Remove the goal “${goal.name}”?`)) return;
    const problem = await deleteGoal(goal.id);
    if (problem) return setStatus(problem);
    saved(`Removed ${goal.name}.`);
  };

  // the suggestions: the ones your books already go furthest into lead as destinations (four, one row),
  // topped up with one of each kind; the rest fold under More goals
  const have = new Set(goals.map((g) => g.name.toLowerCase()));
  const left = CATALOGUE.filter((c) => !have.has(c.name.toLowerCase())).map(
    (c, i) => {
      const p = progress(c);
      return { c, i, p, score: c.kind === "theme" ? -1 : p.done / p.total };
    },
  );
  const pick = !goals.length
    ? left
        .filter((x) => x.score > 0 && x.score < 1)
        .sort((a, b) => b.score - a.score || a.i - b.i)[0]
    : undefined;
  const offered = left.filter((x) => x !== pick);
  const top = offered
    .filter((x) => x.score > 0 && x.score < 1)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 4);
  for (const kind of Object.keys(KIND_GROUP) as GoalKind[]) {
    const x = offered.find((y) => y.c.kind === kind && !top.includes(y));
    if (x && top.length < 4 && !top.some((y) => y.c.kind === kind)) top.push(x);
  }
  const rest = offered.filter((x) => !top.includes(x));

  const suggestions = (
    <section className={s.addGoal} aria-labelledby="add-goal-title">
      <details className={s.sugg} open={!goals.length || undefined}>
        <summary>
          <h2 id="add-goal-title" className={s.h2}>
            Aim somewhere you haven’t read yet
          </h2>
        </summary>
        {pick && (
          <div className={s.pick}>
            <p>
              Your books already reach{" "}
              <b>
                {pick.p.done} of {plural(pick.p.total, "country", "countries")}
              </b>{" "}
              in <b>{pick.c.name}</b>. Make it your first goal?
            </p>
            <button
              type="button"
              className={s.primary}
              onClick={() => add(pick.c)}
            >
              <PlusIcon aria-hidden="true" />
              Add {pick.c.name}
            </button>
          </div>
        )}
        {full && (
          <p className={s.full}>
            Ten goals is plenty. Remove one to add another.
          </p>
        )}
        {top.length > 0 && (
          <ul className={s.dests}>
            {top.map(({ c, p }) => (
              <li key={c.name}>
                <button
                  type="button"
                  className={s.dest}
                  disabled={full}
                  onClick={() => add(c)}
                >
                  <span className={s.destMap}>
                    {c.kind === "theme" ? (
                      <GoalShelf done={0} total={c.target!} />
                    ) : (
                      <GoalPlate
                        codes={p.all}
                        marks={marks}
                        shapes={shapes}
                        continent={c.continent}
                      />
                    )}
                  </span>
                  <span className={s.destName}>{c.name}</span>
                  <span className={s.destNote}>
                    {p.done
                      ? `${p.done} of ${p.total} already`
                      : c.kind === "theme"
                        ? plural(p.total, "book")
                        : plural(p.total, "country", "countries")}
                  </span>
                  <span className={s.destAdd}>
                    <PlusIcon aria-hidden="true" />
                    Add goal
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {rest.length > 0 && (
          <details className={s.more}>
            <summary>
              More goals <span className={s.moreN}>· {rest.length}</span>
            </summary>
            {(Object.keys(KIND_GROUP) as GoalKind[]).map((kind) => {
              const items = rest.filter((x) => x.c.kind === kind);
              return items.length ? (
                <div key={kind} className={s.group}>
                  <h3>{KIND_GROUP[kind]}</h3>
                  <ul className={s.chips}>
                    {items.map(({ c, p }) => (
                      <li key={c.name}>
                        <button
                          type="button"
                          className={s.chip}
                          disabled={full}
                          onClick={() => add(c)}
                        >
                          <PlusIcon aria-hidden="true" />
                          {c.name}
                          {p.done > 0 && c.kind !== "theme" && (
                            <span className={s.chipNote}>
                              {p.done} of {p.total} already
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })}
          </details>
        )}
      </details>
      <button
        type="button"
        className={s.outline}
        aria-haspopup="dialog"
        disabled={full}
        onClick={() => setEditing("new")}
      >
        <PlusIcon aria-hidden="true" />
        Make your own
      </button>
    </section>
  );

  return (
    <div className={s.page}>
      <div className={s.viewHead}>
        <h1 className={s.title}>Goals</h1>
      </div>

      {goals.length ? (
        <>
          <details className={s.yours} open>
            <summary>
              <h2 className={s.h2}>Your goals</h2>
              <span className={s.sum}>
                {plural(goals.length, "goal")}
                {nReached > 0 && ` · ${nReached} reached`}
                {full && " · ten is the most"}
              </span>
            </summary>
            <ul className={s.goalList}>
              {sorted.map((g) => (
                <GoalRow
                  key={g.id}
                  goal={g}
                  progress={progress(g)}
                  marks={marks}
                  shapes={shapes}
                  name={name}
                  onEdit={() => setEditing(g)}
                  onRemove={() => remove(g)}
                  onChooseBooks={() => setChoosing(g)}
                />
              ))}
            </ul>
          </details>
          {suggestions}
        </>
      ) : (
        <>
          <div className={s.empty}>
            {/* a pennant planted on a hilltop at the end of a dashed path, in the landing's sticker style */}
            <svg
              className={s.sticker}
              viewBox="0 0 120 100"
              aria-hidden="true"
              focusable="false"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className={s.gsHill}
                d="M6 88 C 26 70, 44 58, 64 52 C 82 47, 100 56, 114 88 Z"
              />
              <path
                className={s.gsPath}
                d="M14 86 C 30 80, 34 74, 46 70 C 58 66, 56 60, 66 56"
              />
              <circle className={s.gsStart} cx="14" cy="86" r="3" />
              <path className={s.gsPole} d="M66 56 V 18" />
              <path
                className={s.gsCloth}
                d="M66 19 H 92 L 84 28 L 92 37 H 66 Z"
              />
            </svg>
            <h2 className={s.h2}>No goals yet</h2>
            <p>
              A goal gives your reading somewhere to head: a region, a set of
              countries, or a theme you choose books for.{" "}
              {books.length
                ? "Books already on your atlas count straight away."
                : "They start counting with your first book."}
            </p>
          </div>
          {suggestions}
        </>
      )}

      <p className={s.status} role="status">
        {status}
      </p>

      {editing && (
        <GoalDialog
          goal={editing === "new" ? null : editing}
          goals={goals}
          names={names}
          onClose={() => setEditing(null)}
          onSaved={(n) =>
            saved(editing === "new" ? `Goal added: ${n}.` : `Saved ${n}.`)
          }
        />
      )}
      {choosing && (
        <BooksDialog
          goal={choosing}
          books={books}
          onClose={() => setChoosing(null)}
          onSaved={(n) =>
            saved(
              `${plural(n, "book")} ${n === 1 ? "counts" : "count"} toward ${choosing.name}.`,
            )
          }
        />
      )}
    </div>
  );
};

export default GoalsPage;
