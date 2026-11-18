import {
  BooksIcon,
  CheckSquareIcon,
  ImageIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import type { Feature } from 'geojson';

import type { Goal } from '../../../types';
import type { Marks } from '../../../utils/atlasMarks';
import { continentName } from '../../../utils/continents';
import { getLocale } from '../../../paraglide/runtime.js';
import { m } from '../../../paraglide/messages.js';
import { romanDate } from '../../../utils/formatDate';
import { withBold, byName } from '../../../utils/text';
import { Button } from '../../../components/Button/Button';
import ButtonLink from '../../../components/Button/ButtonLink';
import { CATALOGUE, goalName } from '../utils/catalogue';
import { isDone, type Progress } from '../utils/goalProgress';
import { MAX_ROUTE_STOPS } from '../utils/plate';
import * as styles from '../GoalsPage.css';
import Compass from './Compass';
import { GoalPlate } from './GoalPlate';
import GoalShelf from './GoalShelf';
import Postmark from './Postmark';
import { GoalRoute } from './GoalsRoute';

const PERCENT = 100;

type GoalRowProps = {
  goal: Goal;
  progress: Progress;
  marks: Marks;
  shapes: Record<string, Feature>;
  name: (code: string) => string;
  onEdit: () => void;
  onRemove: () => void;
  onChooseBooks: () => void;
  /** just crossed its flag: plays the arrival once */
  arriving?: boolean;
};

/**
 * Shows one goal: its plate (or shelf), name, kind, count, the road to the flag, and its actions.
 * @param arriving - If true, the goal has just been reached, so it plays the arrival once.
 */
const GoalRow = ({
  goal,
  progress: progress,
  marks,
  shapes,
  name,
  onEdit,
  onRemove,
  onChooseBooks,
  arriving,
}: GoalRowProps) => {
  const theme = goal.kind === 'theme';
  const done = isDone(progress);
  const over = progress.done - progress.total;
  const left = progress.all.filter((code) => !progress.reached.includes(code));
  const journal = CATALOGUE.find((entry) => entry.name === goal.name)?.journal;
  const title = goalName(goal.name);

  const meta =
    goal.kind === 'region'
      ? m.goals_meta_region({ continent: continentName(goal.continent!) })
      : goal.kind === 'countries'
        ? m.goals_meta_countries()
        : m.goals_meta_theme();

  return (
    <li
      className={[
        styles.goal,
        done && styles.goalDone,
        arriving && styles.goalArriving,
      ]
        .filter(Boolean)
        .join(' ')}
      data-goal={goal.id}
    >
      <div className={styles.goalMap}>
        {theme ? (
          <GoalShelf done={progress.done} total={progress.total} />
        ) : (
          <>
            <GoalPlate
              codes={progress.all}
              marks={marks}
              shapes={shapes}
              continent={goal.continent}
            />
            <Compass />
          </>
        )}
        {done && goal.reachedOn && (
          <Postmark id={goal.id} date={romanDate(goal.reachedOn)} />
        )}
      </div>
      <div className={styles.goalBody}>
        <div className={styles.goalHead}>
          <div>
            <h3 className={styles.goalName} tabIndex={-1}>
              {title}
            </h3>
            <p className={styles.goalMeta}>{meta}</p>
          </div>
          <div className={styles.goalCount}>
            <span aria-hidden="true">
              {withBold(
                m.goals_of({ done: progress.done, total: progress.total })
              )}
              {progress.total > MAX_ROUTE_STOPS && !done && (
                <span className={styles.goalPct}>
                  {' '}
                  · {Math.round((PERCENT * progress.done) / progress.total)}%
                </span>
              )}
            </span>
            <span className={styles.srOnly}>
              {(theme ? m.goals_of_books : m.goals_of_countries)({
                done: progress.done,
                count: progress.total,
              })}
            </span>
            {done && (
              <span className={styles.goalReached}>
                {goal.reachedOn ? (
                  <span className={styles.srOnly}>
                    {m.goals_reached_on({
                      date: new Date(
                        `${goal.reachedOn}T00:00`
                      ).toLocaleDateString(getLocale(), {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }),
                    })}
                  </span>
                ) : (
                  m.goals_reached()
                )}
                {over > 0 && (
                  <span className={styles.goalPast}>
                    {m.goals_past_flag({ count: over })}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <GoalRoute done={progress.done} total={progress.total} theme={theme} />
        <div className={styles.goalFoot}>
          {!theme && (
            <details className={styles.goalTodo}>
              <summary>{m.goals_show_countries()}</summary>
              {progress.reached.length > 0 && (
                <p>
                  <b>{m.goals_on_atlas()}</b> {byName(progress.reached, name)}.
                </p>
              )}
              {left.length > 0 && (
                <p>
                  <b>{m.goals_still_to_reach()}</b> {byName(left, name)}.
                </p>
              )}
            </details>
          )}
          <div className={styles.goalActions}>
            {theme && (
              <Button
                type="button"
                variant="link"
                className={styles.chooseBtn}
                aria-haspopup="dialog"
                onClick={onChooseBooks}
              >
                <CheckSquareIcon aria-hidden="true" />
                {m.goals_choose_books()}
              </Button>
            )}
            {journal && (
              <ButtonLink variant="link" to="/journal">
                <BooksIcon aria-hidden="true" />
                {m.goals_reading_ideas()}
              </ButtonLink>
            )}
            {done && goal.reachedOn && (
              <ButtonLink
                variant="link"
                to="/app/postcard"
                search={{ goal: goal.id }}
                aria-label={m.goals_postcard_for({ goal: title })}
              >
                <ImageIcon aria-hidden="true" />
                {m.nav_postcard()}
              </ButtonLink>
            )}
            <Button
              type="button"
              variant="link"
              aria-haspopup="dialog"
              aria-label={m.goals_edit_label({ goal: title })}
              onClick={onEdit}
            >
              <PencilSimpleIcon aria-hidden="true" />
              {m.common_edit()}
            </Button>
            <Button
              type="button"
              variant="link"
              data-remove-goal
              aria-label={m.goals_remove_label({ goal: title })}
              onClick={onRemove}
            >
              <TrashIcon aria-hidden="true" />
              {m.goals_remove()}
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default GoalRow;
