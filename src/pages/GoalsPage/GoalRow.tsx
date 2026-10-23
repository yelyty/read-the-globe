import {
  CheckSquareIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { Feature } from "geojson";
import type { Goal } from "../../types";
import type { Marks } from "../../utils/atlasMarks";
import { CONTINENT_NAMES } from "../../utils/continents";
import { isDone, plural, type Progress } from "./goals";
import { Compass, GoalPlate, GoalShelf } from "./GoalPlate";
import { GoalRoute } from "./GoalsRoute";
import * as s from "./GoalsPage.css";

type GoalRowProps = {
  goal: Goal;
  progress: Progress;
  marks: Marks;
  shapes: Record<string, Feature>;
  name: (code: string) => string;
  onEdit: () => void;
  onRemove: () => void;
  onChooseBooks: () => void;
};

const byName = (codes: string[], name: (code: string) => string) =>
  codes
    .map(name)
    .sort((a, b) => a.localeCompare(b))
    .join(", ");

// One goal, as in the app mock: its plate (or shelf), name, kind, count, the road to the flag, and actions
const GoalRow = ({
  goal,
  progress: p,
  marks,
  shapes,
  name,
  onEdit,
  onRemove,
  onChooseBooks,
}: GoalRowProps) => {
  const theme = goal.kind === "theme";
  const done = isDone(p);
  const over = p.done - p.total;
  const left = p.all.filter((c) => !p.reached.includes(c));
  const meta =
    goal.kind === "region"
      ? `Region · ${CONTINENT_NAMES[goal.continent!]}`
      : goal.kind === "countries"
        ? "Countries you chose"
        : "Theme · you tick the books that count";

  return (
    <li className={done ? `${s.goal} ${s.goalDone}` : s.goal}>
      <div className={s.goalMap}>
        {theme ? (
          <GoalShelf done={p.done} total={p.total} />
        ) : (
          <>
            <GoalPlate
              codes={p.all}
              marks={marks}
              shapes={shapes}
              continent={goal.continent}
            />
            <Compass />
          </>
        )}
      </div>
      <div className={s.goalBody}>
        <div className={s.goalHead}>
          <div>
            <h3 className={s.goalName}>{goal.name}</h3>
            <p className={s.goalMeta}>{meta}</p>
          </div>
          <div className={s.goalCount}>
            <span aria-hidden="true">
              <b>{p.done}</b> of {p.total}
              {p.total > 30 && !done && (
                <span className={s.goalPct}>
                  {" "}
                  · {Math.round((100 * p.done) / p.total)}%
                </span>
              )}
            </span>
            <span
              className={s.srOnly}
            >{`${p.done} of ${plural(p.total, theme ? "book" : "country", theme ? "books" : "countries")}`}</span>
            {done && (
              <span className={s.goalReached}>
                {goal.reachedOn
                  ? `Reached ${new Date(`${goal.reachedOn}T00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`
                  : "Reached"}
                {over > 0 && (
                  <span className={s.goalPast}>{over} past the flag</span>
                )}
              </span>
            )}
          </div>
        </div>
        <GoalRoute done={p.done} total={p.total} theme={theme} />
        <div className={s.goalFoot}>
          {!theme && (
            <details className={s.goalTodo}>
              <summary>Show countries</summary>
              {p.reached.length > 0 && (
                <p>
                  <b>On your atlas:</b> {byName(p.reached, name)}.
                </p>
              )}
              {left.length > 0 && (
                <p>
                  <b>Still to reach:</b> {byName(left, name)}.
                </p>
              )}
            </details>
          )}
          <div className={s.goalActions}>
            {theme && (
              <button
                type="button"
                className={`${s.linkBtn} ${s.chooseBtn}`}
                aria-haspopup="dialog"
                onClick={onChooseBooks}
              >
                <CheckSquareIcon aria-hidden="true" />
                Choose books
              </button>
            )}
            <button
              type="button"
              className={s.linkBtn}
              aria-haspopup="dialog"
              aria-label={`Edit goal: ${goal.name}`}
              onClick={onEdit}
            >
              <PencilSimpleIcon aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              className={s.linkBtn}
              aria-label={`Remove goal: ${goal.name}`}
              onClick={onRemove}
            >
              <TrashIcon aria-hidden="true" />
              Remove goal
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default GoalRow;
