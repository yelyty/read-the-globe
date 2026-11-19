import type { Goal } from '../../types';
import { useCountryNames } from '../../hooks/useCountryNames';
import { useBooks, useGoals } from '../../hooks/useReader';
import { useWorldShapes } from '../../hooks/useWorldShapes';
import { m } from '../../paraglide/messages.js';
import PageTitle from '../../components/PageTitle/PageTitle';
import EmptyState from '../../components/EmptyState/EmptyState';
import GoalsSticker from '../../components/Sticker/GoalsSticker';
import { useAddFromLink } from './hooks/useAddFromLink';
import { useGoalActions } from './hooks/useGoalActions';
import { useGoalDialogs } from './hooks/useGoalDialogs';
import { useGoalFocus } from './hooks/useGoalFocus';
import { useGoalList } from './hooks/useGoalList';
import { useReachedStamps } from './hooks/useReachedStamps';
import GoalRow from './components/GoalRow';
import GoalSuggestions from './features/GoalSuggestions/GoalSuggestions';
import GoalsDialog from './features/GoalsDialog/GoalsDialog';
import BooksDialog from './features/BooksDialog/BooksDialog';
import * as styles from './GoalsPage.css';

/**
 * Shows the Goals page: the goals of the reader with their progress, and suggestions for new goals.
 */
const GoalsPage = () => {
  const books = useBooks();
  const goals = useGoals();
  const shapes = useWorldShapes();
  const names = useCountryNames();
  // both come from the one map, a moment apart: wait for the names too, so no country shows as a bare code
  const ready = Boolean(shapes && Object.keys(names).length);

  const { marks, progress, sorted, reachedCount, full } = useGoalList(
    goals,
    books
  );

  const arriving = useReachedStamps(goals, books);
  const focusGoal = useGoalFocus(goals, ready);

  const { saved, add, remove } = useGoalActions({
    books,
    sorted,
    full,
    focusGoal,
  });

  useAddFromLink({ goals, add, focusGoal });

  const {
    editing,
    choosing,
    handleNewGoal,
    handleEdit,
    handleChooseBooks,
    handleEditClose,
    handleChooseClose,
    handleGoalSaved,
    handleBooksSaved,
  } = useGoalDialogs(saved);

  if (!shapes || !ready) return <div />;

  const name = (code: string) => names[code] ?? code;
  const handleRemove = (goal: Goal) => () => remove(goal);

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
                {reachedCount > 0 &&
                  ` · ${m.goals_sum_reached({ count: reachedCount })}`}
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
            art={<GoalsSticker />}
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
        <GoalsDialog
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
