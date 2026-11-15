import { useEffect, useRef, useState } from 'react';
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router';
import type { Feature } from 'geojson';

import type { Goal } from '../../types';
import { atlasMarks } from '../../utils/atlasMarks';
import { worldShapes } from '../../utils/world';
import { addGoal, deleteGoal, restoreGoal } from '../../api/goals/goals';
import { useStatus } from '../../hooks/useStatus';
import { useUndo } from '../../hooks/useUndo';
import { prefersReducedMotion } from '../../utils/motion';
import { useCountryNames } from '../../hooks/useCountryNames';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import EmptyState from '../../components/EmptyState/EmptyState';
import HilltopSticker from '../../components/Sticker/HilltopSticker';
import { CATALOGUE, MAX_GOALS, goalName } from './catalogue';
import { goalProgress, isDone, type GoalDraft } from './goalProgress';
import { useReachedStamps } from './useReachedStamps';
import GoalRow from './GoalRow';
import GoalSuggestions from './GoalSuggestions';
import GoalDialog from './GoalsDialog';
import BooksDialog from './BooksDialog';
import * as styles from './GoalsPage.css';

const app = getRouteApi('/app');
const route = getRouteApi('/app/goals');

const GoalsPage = () => {
  const { books, goals } = app.useLoaderData();
  const router = useRouter();
  const [shapes, setShapes] = useState<Record<string, Feature>>();
  const [editing, setEditing] = useState<Goal | 'new' | null>(null);
  const [choosing, setChoosing] = useState<Goal | null>(null);
  const status = useStatus();
  const offerUndo = useUndo();
  const names = useCountryNames();
  const say = (text: string) => status.show({ text });
  const { add: addSlug } = route.useSearch();
  const navigate = useNavigate();
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
  const arriving = useReachedStamps(goals, books);

  const progress = (draft: GoalDraft & { id?: number }) =>
    goalProgress(draft, marks, books);

  useEffect(() => {
    const focused = goals.find(
      (goal) => goal.name.toLowerCase() === focusName.current
    );

    const heading =
      focused &&
      document.querySelector<HTMLElement>(`[data-goal="${focused.id}"] h3`);

    if (!heading) return;
    focusName.current = null;

    heading.scrollIntoView({
      block: 'center',
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });

    heading.focus({ preventScroll: true });
  }, [goals, shapes]);

  // ?add=<slug>: a Journal article's "Add this goal" lands here and adds it once, or shows it if it's already there
  const added = useRef<string | null>(null);

  useEffect(() => {
    if (!addSlug || added.current === addSlug) return;
    added.current = addSlug;
    navigate({ to: '/app/goals', search: {}, replace: true });
    const entry = CATALOGUE.find((item) => item.slug === addSlug);

    if (!entry) return;
    const name = entry.name.toLowerCase();

    if (goals.some((goal) => goal.name.toLowerCase() === name)) {
      focusName.current = name;

      return;
    }

    if (goals.length >= MAX_GOALS) return;

    addGoal(entry).then((problem) => {
      if (problem) return say(problem);
      saved(m.goals_added({ goal: goalName(entry.name) }), entry.name);
    });
  });

  // both come from the one map, a moment apart: wait for the names too, so no country shows as a bare code
  if (!shapes || !Object.keys(names).length) return <div />;

  const name = (code: string) => names[code] ?? code;
  const full = goals.length >= MAX_GOALS;

  const sorted = [
    ...goals.filter((goal) => !isDone(progress(goal))),
    ...goals.filter((goal) => isDone(progress(goal))),
  ];

  const nReached =
    goals.length - goals.filter((goal) => !isDone(progress(goal))).length;

  const add = async (draft: GoalDraft) => {
    if (full) return;
    const problem = await addGoal(draft);

    if (problem) return say(problem);
    saved(m.goals_added({ goal: goalName(draft.name) }), draft.name);
  };

  const remove = async (goal: Goal) => {
    const ticked = books
      .filter((book) => book.goals.some((link) => link.goalId === goal.id))
      .map((book) => book.id);

    const at = sorted.indexOf(goal);
    const problem = await deleteGoal(goal.id);

    if (problem) return say(problem);
    await router.invalidate();
    // focus goes to the row now in its place, or to the suggestions when it was the last one
    const left = document.querySelectorAll<HTMLElement>('[data-remove-goal]');

    (
      left[Math.min(at, left.length - 1)] ??
      document.querySelector<HTMLElement>(`.${styles.sugg} > summary`)
    )?.focus();

    offerUndo({
      said: ticked.length
        ? m.goals_removed_unticked({
            goal: goalName(goal.name),
            books: m.count_book({ count: ticked.length }),
          })
        : m.goals_removed({ goal: goalName(goal.name) }),
      // back, it takes focus again once its row shows up
      undo: async () => {
        const problem = await restoreGoal(goal, ticked);

        if (!problem) focusName.current = goal.name.trim().toLowerCase();

        return problem;
      },
      undone: m.goals_back({ goal: goalName(goal.name) }),
    });
  };

  /* ---------- lists ---------- */

  /* ---------- handlers ---------- */
  const handleNewGoal = () => setEditing('new');
  const handleEdit = (goal: Goal) => () => setEditing(goal);
  const handleRemove = (goal: Goal) => () => remove(goal);
  const handleChooseBooks = (goal: Goal) => () => setChoosing(goal);
  const handleEditClose = () => setEditing(null);
  const handleChooseClose = () => setChoosing(null);

  // the line said after a save names the goal; a new one is also scrolled to
  const handleGoalSaved = (savedName: string) =>
    saved(
      (editing === 'new' ? m.goals_added : m.goals_saved)({
        goal: goalName(savedName),
      }),
      savedName
    );

  const handleBooksSaved = (count: number) =>
    choosing &&
    saved(m.goals_books_counted({ count, goal: goalName(choosing.name) }));

  return (
    <>
      <PageTitle>{m.nav_goals()}</PageTitle>

      <GoalSuggestions
        goals={goals}
        marks={marks}
        shapes={shapes}
        progress={progress}
        full={full}
        onAdd={add}
        onNewGoal={handleNewGoal}
      />
      {goals.length ? (
        <>
          <details className={styles.yours} open>
            <summary>
              <h2 className={styles.h2}>{m.goals_yours()}</h2>
              <span className={styles.sum}>
                {m.count_goal({ count: goals.length })}
                {nReached > 0 &&
                  ` · ${m.goals_sum_reached({ count: nReached })}`}
                {full && ` · ${m.goals_sum_full()}`}
              </span>
            </summary>
            <ul className={styles.goalList}>
              {sorted.map((goal) => (
                <GoalRow
                  key={goal.id}
                  goal={goal}
                  progress={progress(goal)}
                  marks={marks}
                  shapes={shapes}
                  name={name}
                  onEdit={handleEdit(goal)}
                  onRemove={handleRemove(goal)}
                  onChooseBooks={handleChooseBooks(goal)}
                  arriving={arriving.includes(goal.id)}
                />
              ))}
            </ul>
          </details>
        </>
      ) : (
        <>
          <EmptyState
            className={styles.empty}
            art={<HilltopSticker />}
            title={m.goals_empty_title()}
            text={`${m.goals_empty_text()} ${
              books.length
                ? m.goals_empty_have_books()
                : m.goals_empty_no_books()
            }`}
          />
        </>
      )}

      {editing && (
        <GoalDialog
          goal={editing === 'new' ? null : editing}
          goals={goals}
          names={names}
          onClose={handleEditClose}
          onSaved={handleGoalSaved}
        />
      )}
      {choosing && (
        <BooksDialog
          goal={choosing}
          books={books}
          onClose={handleChooseClose}
          onSaved={handleBooksSaved}
        />
      )}
    </>
  );
};

export default GoalsPage;
