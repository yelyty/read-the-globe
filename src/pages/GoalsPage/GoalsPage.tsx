import { useEffect, useRef, useState } from 'react';
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router';
import type { Feature } from 'geojson';
import type { Goal, GoalKind } from '../../types';
import { ArrowCounterClockwiseIcon, PlusIcon } from '@phosphor-icons/react';
import { atlasMarks } from '../../utils/atlasMarks';
import { worldShapes } from '../../utils/worldShapes';
import {
  addGoal,
  deleteGoal,
  markReached,
  restoreGoal,
} from '../../api/goals/goals';
import { useStatus } from '../../hooks/useStatus';
import { reducedMotion } from '../../styles/global.css';
import {
  CATALOGUE,
  KIND_GROUP,
  MAX_GOALS,
  goalName,
  goalProgress,
  isDone,
  today,
  withBold,
  type GoalDraft,
} from './goals';
import { useCountryNames } from '../../hooks/useCountryNames';
import { m } from '../../paraglide/messages.js';
import { GoalPlate, GoalShelf } from './GoalPlate';
import GoalRow from './GoalRow';
import GoalDialog from './GoalsDialog';
import BooksDialog from './BooksDialog';
import * as s from './GoalsPage.css';
import PageTitle from '../../components/PageTitle/PageTitle';

const app = getRouteApi('/app');
const route = getRouteApi('/app/goals');

const GoalsPage = () => {
  const { books, goals } = app.useLoaderData();
  const router = useRouter();
  const [shapes, setShapes] = useState<Record<string, Feature>>();
  const [editing, setEditing] = useState<Goal | 'new' | null>(null);
  const [choosing, setChoosing] = useState<Goal | null>(null);
  const status = useStatus();
  const localNames = useCountryNames();
  const say = (text: string) => status.show({ text });
  const { add: addSlug } = route.useSearch();
  const navigate = useNavigate();
  // goals that crossed their flag while the reader looked: each gets the arrival once
  const [arriving, setArriving] = useState<number[]>([]);
  // the goal to focus once it shows up in the list: one just added, or back from Undo
  const focusName = useRef<string | null>(null);

  useEffect(() => {
    worldShapes().then(setShapes);
  }, []);

  const saved = async (message: string, focus?: string) => {
    say(message);
    if (focus) focusName.current = focus.trim().toLowerCase();
    await router.invalidate();
  };

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
      changes.map(({ g, done }) => markReached(g.id, done ? today() : null))
    ).then((problems) => {
      if (!problems.every((p) => !p)) return;
      if (!matchMedia(reducedMotion).matches)
        setArriving((a) => [
          ...a,
          ...changes.filter((c) => c.done).map((c) => c.g.id),
        ]);
      router.invalidate();
    });
  }, [goals, books, shapes, router]);

  useEffect(() => {
    const g = goals.find((x) => x.name.toLowerCase() === focusName.current);

    const h =
      g && document.querySelector<HTMLElement>(`[data-goal="${g.id}"] h3`);

    if (!h) return;
    focusName.current = null;

    h.scrollIntoView({
      block: 'center',
      behavior: matchMedia(reducedMotion).matches ? 'auto' : 'smooth',
    });

    h.focus({ preventScroll: true });
  }, [goals, shapes]);

  // ?add=<slug>: a Journal article's "Add this goal" lands here and adds it once, or shows it if it's already there
  const added = useRef<string | null>(null);

  useEffect(() => {
    if (!addSlug || added.current === addSlug) return;
    added.current = addSlug;
    navigate({ to: '/app/goals', search: {}, replace: true });
    const c = CATALOGUE.find((x) => x.slug === addSlug);

    if (!c) return;
    const name = c.name.toLowerCase();

    if (goals.some((g) => g.name.toLowerCase() === name)) {
      focusName.current = name;

      return;
    }

    if (goals.length >= MAX_GOALS) return;

    addGoal(c).then((problem) => {
      if (problem) return say(problem);
      saved(m.goals_added({ goal: goalName(c.name) }), c.name);
    });
  });

  if (!shapes) return <div />;

  // the map's own names, in the reader's language once those have loaded
  const names: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(shapes)
        .filter(([, f]) => f.properties?.name)
        .map(([code, f]) => [code, f.properties!.name as string])
    ),
    ...localNames,
  };

  const name = (code: string) => names[code] ?? code;
  const full = goals.length >= MAX_GOALS;

  const sorted = [
    ...goals.filter((g) => !isDone(progress(g))),
    ...goals.filter((g) => isDone(progress(g))),
  ];

  const nReached =
    goals.length - goals.filter((g) => !isDone(progress(g))).length;

  const add = async (draft: GoalDraft) => {
    if (full) return;
    const problem = await addGoal(draft);

    if (problem) return say(problem);
    saved(m.goals_added({ goal: goalName(draft.name) }), draft.name);
  };

  const remove = async (goal: Goal) => {
    const ticked = books
      .filter((b) => b.goals.some((g) => g.goalId === goal.id))
      .map((b) => b.id);

    const at = sorted.indexOf(goal);
    const problem = await deleteGoal(goal.id);

    if (problem) return say(problem);
    await router.invalidate();
    // focus goes to the row now in its place, or to the suggestions when it was the last one
    const left = document.querySelectorAll<HTMLElement>('[data-remove-goal]');

    (
      left[Math.min(at, left.length - 1)] ??
      document.querySelector<HTMLElement>(`.${s.sugg} > summary`)
    )?.focus();

    status.show({
      text: ticked.length
        ? m.goals_removed_unticked({
            goal: goalName(goal.name),
            books: m.count_book({ count: ticked.length }),
          })
        : m.goals_removed({ goal: goalName(goal.name) }),
      action: {
        label: m.common_undo(),
        icon: <ArrowCounterClockwiseIcon aria-hidden="true" />,
        run: async () => {
          const problem = await restoreGoal(goal, ticked);

          if (problem) return say(problem);
          saved(m.goals_back({ goal: goalName(goal.name) }), goal.name);
        },
      },
    });
  };

  // the suggestions: the ones your books already go furthest into lead as destinations (four, one row),
  // topped up with one of each kind; the rest fold under More goals
  const have = new Set(goals.map((g) => g.name.toLowerCase()));

  const left = CATALOGUE.filter((c) => !have.has(c.name.toLowerCase())).map(
    (c, i) => {
      const p = progress(c);

      return { c, i, p, score: c.kind === 'theme' ? -1 : p.done / p.total };
    }
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
            {m.goals_aim()}
          </h2>
        </summary>
        {pick && (
          <div className={s.pick}>
            <p>
              {withBold(
                m.goals_pick({
                  done: pick.p.done,
                  count: pick.p.total,
                  goal: goalName(pick.c.name),
                })
              )}
            </p>
            <button
              type="button"
              className={s.primary}
              onClick={() => add(pick.c)}
            >
              <PlusIcon aria-hidden="true" />
              {m.goals_add_named({ goal: goalName(pick.c.name) })}
            </button>
          </div>
        )}
        {full && <p className={s.full}>{m.goals_full()}</p>}
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
                    {c.kind === 'theme' ? (
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
                  <span className={s.destName}>{goalName(c.name)}</span>
                  <span className={s.destNote}>
                    {p.done
                      ? m.goals_already({ done: p.done, total: p.total })
                      : c.kind === 'theme'
                        ? m.count_book({ count: p.total })
                        : m.count_country({ count: p.total })}
                  </span>
                  <span className={s.destAdd}>
                    <PlusIcon aria-hidden="true" />
                    {m.goals_add_goal()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {rest.length > 0 && (
          <details className={s.more}>
            <summary>
              {m.goals_more()} <span className={s.moreN}>· {rest.length}</span>
            </summary>
            {(Object.keys(KIND_GROUP) as GoalKind[]).map((kind) => {
              const items = rest.filter((x) => x.c.kind === kind);

              return items.length ? (
                <div key={kind} className={s.group}>
                  <h3>{KIND_GROUP[kind]()}</h3>
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
                          {goalName(c.name)}
                          {p.done > 0 && c.kind !== 'theme' && (
                            <span className={s.chipNote}>
                              {m.goals_already({
                                done: p.done,
                                total: p.total,
                              })}
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
        onClick={() => setEditing('new')}
      >
        <PlusIcon aria-hidden="true" />
        {m.goals_make_own()}
      </button>
    </section>
  );

  return (
    <>
      <PageTitle>{m.nav_goals()}</PageTitle>

      {suggestions}
      {goals.length ? (
        <>
          <details className={s.yours} open>
            <summary>
              <h2 className={s.h2}>{m.goals_yours()}</h2>
              <span className={s.sum}>
                {m.count_goal({ count: goals.length })}
                {nReached > 0 &&
                  ` · ${m.goals_sum_reached({ count: nReached })}`}
                {full && ` · ${m.goals_sum_full()}`}
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
                  arriving={arriving.includes(g.id)}
                />
              ))}
            </ul>
          </details>
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
            <h2 className={s.h2}>{m.goals_empty_title()}</h2>
            <p>
              {m.goals_empty_text()}{' '}
              {books.length
                ? m.goals_empty_have_books()
                : m.goals_empty_no_books()}
            </p>
          </div>
        </>
      )}

      {editing && (
        <GoalDialog
          goal={editing === 'new' ? null : editing}
          goals={goals}
          names={names}
          onClose={() => setEditing(null)}
          onSaved={(n) =>
            saved(
              (editing === 'new' ? m.goals_added : m.goals_saved)({
                goal: goalName(n),
              }),
              n
            )
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
              m.goals_books_counted({
                count: n,
                goal: goalName(choosing.name),
              })
            )
          }
        />
      )}
    </>
  );
};

export default GoalsPage;
