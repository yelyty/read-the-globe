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
import { CONTINENT_NAMES } from '../../utils/continents';
import { CATALOGUE, isDone, plural, romanDate, type Progress } from './goals';
import { Compass, GoalPlate, GoalShelf } from './GoalPlate';
import { GoalRoute } from './GoalsRoute';
import * as s from './GoalsPage.css';

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
    .sort((a, b) => a.localeCompare(b))
    .join(', ');

/* The reached stamp, inked like a real postmark: wavy cancellation lines trailing over the plate, a double ring with
   "GOAL REACHED" running round it, a little pennant over the date, and a rough edge from an SVG turbulence filter. */
const Postmark = ({ id, date }: { id: number; date: string }) => (
  <svg className={s.stamp} viewBox="0 0 120 80" aria-hidden="true">
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
        className={s.pmWave}
        d="M2 27q6.5-5 13 0t13 0 13 0 13 0M2 35q6.5-5 13 0t13 0 13 0 13 0M2 43q6.5-5 13 0t13 0 13 0 13 0M2 51q6.5-5 13 0t13 0 13 0 13 0"
      />
      <circle className={`${s.pmRing} ${s.pmRingOut}`} cx="84" cy="40" r="31" />
      <circle className={s.pmRing} cx="84" cy="40" r="18.5" />
      <text className={s.pmArc}>
        <textPath href={`#arc-${id}`} textLength="146" lengthAdjust="spacing">
          GOAL REACHED ✦ GOAL REACHED ✦
        </textPath>
      </text>
      <path
        className={s.pmFlag}
        d="M80 26.5v11M80 27h8.5l-2.6 2.8 2.6 2.9H80"
      />
      <text className={s.pmDate} x="84" y="49" textAnchor="middle">
        {date}
      </text>
    </g>
  </svg>
);

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
  arriving,
}: GoalRowProps) => {
  const theme = goal.kind === 'theme';
  const done = isDone(p);
  const over = p.done - p.total;
  const left = p.all.filter((c) => !p.reached.includes(c));
  const journal = CATALOGUE.find((c) => c.name === goal.name)?.journal;
  const meta =
    goal.kind === 'region'
      ? `Region · ${CONTINENT_NAMES[goal.continent!]}`
      : goal.kind === 'countries'
        ? 'Countries you chose'
        : 'Theme · you tick the books that count';

  return (
    <li
      className={[s.goal, done && s.goalDone, arriving && s.goalArriving]
        .filter(Boolean)
        .join(' ')}
      data-goal={goal.id}
    >
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
        {done && goal.reachedOn && (
          <Postmark id={goal.id} date={romanDate(goal.reachedOn)} />
        )}
      </div>
      <div className={s.goalBody}>
        <div className={s.goalHead}>
          <div>
            <h3 className={s.goalName} tabIndex={-1}>
              {goal.name}
            </h3>
            <p className={s.goalMeta}>{meta}</p>
          </div>
          <div className={s.goalCount}>
            <span aria-hidden="true">
              <b>{p.done}</b> of {p.total}
              {p.total > 30 && !done && (
                <span className={s.goalPct}>
                  {' '}
                  · {Math.round((100 * p.done) / p.total)}%
                </span>
              )}
            </span>
            <span
              className={s.srOnly}
            >{`${p.done} of ${plural(p.total, theme ? 'book' : 'country', theme ? 'books' : 'countries')}`}</span>
            {done && (
              <span className={s.goalReached}>
                {goal.reachedOn ? (
                  <span className={s.srOnly}>
                    {`Reached on ${new Date(`${goal.reachedOn}T00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </span>
                ) : (
                  'Reached'
                )}
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
            {journal && (
              <Link className={s.linkBtn} to="/journal">
                <BooksIcon aria-hidden="true" />
                Reading ideas
              </Link>
            )}
            {done && goal.reachedOn && (
              <Link
                className={s.linkBtn}
                to="/app/postcard"
                search={{ goal: goal.id }}
                aria-label={`Postcard for ${goal.name}`}
              >
                <ImageIcon aria-hidden="true" />
                Postcard
              </Link>
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
              data-remove-goal
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
