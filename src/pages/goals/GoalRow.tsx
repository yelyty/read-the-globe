import {
  BooksIcon,
  CheckSquareIcon,
  ImageIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import type { Feature } from 'geojson';
import type { Goal } from '../../types';
import type { Marks } from '../../utils/atlasMarks';
import { continentName } from '../../utils/continents';
import { getLocale } from '../../paraglide/runtime.js';
import { m } from '../../paraglide/messages.js';
import {
  CATALOGUE,
  goalName,
  isDone,
  romanDate,
  withBold,
  type Progress,
} from './goals';
import { Compass, GoalPlate, GoalShelf } from './GoalPlate';
import { GoalRoute } from './GoalsRoute';
import * as styles from './GoalsPage.css';

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

const byName = (codes: string[], name: (code: string) => string) =>
  codes
    .map(name)
    .sort((first, second) => first.localeCompare(second, getLocale()))
    .join(', ');

/* The reached stamp, inked like a real postmark: wavy cancellation lines trailing over the plate, a double ring with
   "GOAL REACHED" running round it, a little pennant over the date, and a rough edge from an SVG turbulence filter. */
const Postmark = ({ id, date }: { id: number; date: string }) => (
  <svg className={styles.stamp} viewBox="0 0 120 80" aria-hidden="true">
    <defs>
      <filter id={`ink-${id}`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency=".9"
          numOctaves={2}
          seed={String(id).length * 7}
        />
        <feDisplacementMap in="SourceGraphic" scale="1.6" />
      </filter>
      <path
        id={`arc-${id}`}
        d="M84 40m-23.5 0a23.5 23.5 0 1 1 47 0a23.5 23.5 0 1 1-47 0"
      />
    </defs>
    <g filter={`url(#ink-${id})`}>
      <path
        className={styles.pmWave}
        d="M2 27q6.5-5 13 0t13 0 13 0 13 0M2 35q6.5-5 13 0t13 0 13 0 13 0M2 43q6.5-5 13 0t13 0 13 0 13 0M2 51q6.5-5 13 0t13 0 13 0 13 0"
      />
      <circle
        className={`${styles.pmRing} ${styles.pmRingOut}`}
        cx="84"
        cy="40"
        r="31"
      />
      <circle className={styles.pmRing} cx="84" cy="40" r="18.5" />
      <text className={styles.pmArc}>
        <textPath href={`#arc-${id}`} textLength="146" lengthAdjust="spacing">
          {`${m.goals_postmark()} ✦ ${m.goals_postmark()} ✦`}
        </textPath>
      </text>
      <path
        className={styles.pmFlag}
        d="M80 26.5v11M80 27h8.5l-2.6 2.8 2.6 2.9H80"
      />
      <text className={styles.pmDate} x="84" y="49" textAnchor="middle">
        {date}
      </text>
    </g>
  </svg>
);

// One goal, as in the app mock: its plate (or shelf), name, kind, count, the road to the flag, and actions
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
              {progress.total > 30 && !done && (
                <span className={styles.goalPct}>
                  {' '}
                  · {Math.round((100 * progress.done) / progress.total)}%
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
              <button
                type="button"
                className={`${styles.linkBtn} ${styles.chooseBtn}`}
                aria-haspopup="dialog"
                onClick={onChooseBooks}
              >
                <CheckSquareIcon aria-hidden="true" />
                {m.goals_choose_books()}
              </button>
            )}
            {journal && (
              <Link className={styles.linkBtn} to="/journal">
                <BooksIcon aria-hidden="true" />
                {m.goals_reading_ideas()}
              </Link>
            )}
            {done && goal.reachedOn && (
              <Link
                className={styles.linkBtn}
                to="/app/postcard"
                search={{ goal: goal.id }}
                aria-label={m.goals_postcard_for({ goal: title })}
              >
                <ImageIcon aria-hidden="true" />
                {m.nav_postcard()}
              </Link>
            )}
            <button
              type="button"
              className={styles.linkBtn}
              aria-haspopup="dialog"
              aria-label={m.goals_edit_label({ goal: title })}
              onClick={onEdit}
            >
              <PencilSimpleIcon aria-hidden="true" />
              {m.common_edit()}
            </button>
            <button
              type="button"
              className={styles.linkBtn}
              data-remove-goal
              aria-label={m.goals_remove_label({ goal: title })}
              onClick={onRemove}
            >
              <TrashIcon aria-hidden="true" />
              {m.goals_remove()}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default GoalRow;
