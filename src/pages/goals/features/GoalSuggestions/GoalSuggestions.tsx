import type { Feature } from 'geojson';
import { PlusIcon } from '@phosphor-icons/react';

import type { Goal } from '../../../../types';
import type { Marks } from '../../../../utils/atlasMarks';
import { m } from '../../../../paraglide/messages.js';
import { withBold } from '../../../../utils/text';
import { Button } from '../../../../components/Button/Button';
import { goalName, type CatalogueGoal } from '../../utils/catalogue';
import type { Progress } from '../../utils/goalProgress';
import * as styles from '../../GoalsPage.css';
import { suggestGoals } from './suggestions';
import GoalDestination from './GoalDestination';
import SuggestionGroup from './SuggestionGroup';

type GoalSuggestionsProps = {
  goals: Goal[];
  marks: Marks;
  shapes: Record<string, Feature>;
  progress: (goal: CatalogueGoal) => Progress;
  /** at the most goals there can be: nothing more can be added */
  full: boolean;
  onAdd: (goal: CatalogueGoal) => void;
  onNewGoal: () => void;
};

/**
 * Shows Aim for: the goal to pick first, the goals the reader is already into, More goals by kind, and Make your own.
 * @param full - If true, the reader has the most goals there can be, so nothing more can be added.
 */
const GoalSuggestions = ({
  goals,
  marks,
  shapes,
  progress,
  full,
  onAdd,
  onNewGoal,
}: GoalSuggestionsProps) => {
  const { pick, top, rest, groups } = suggestGoals(goals, progress);

  const handleAdd = (draft: CatalogueGoal) => () => onAdd(draft);

  /* ---------- lists ---------- */

  return (
    <section className={styles.addGoal} aria-labelledby="add-goal-title">
      <details className={styles.sugg} open={!goals.length || undefined}>
        <summary>
          <h2 id="add-goal-title" className={styles.h2}>
            {m.goals_aim()}
          </h2>
        </summary>
        {pick && (
          <div className={styles.pick}>
            <p>
              {withBold(
                m.goals_pick({
                  done: pick.p.done,
                  count: pick.p.total,
                  goal: goalName(pick.c.name),
                })
              )}
            </p>
            <Button type="button" variant="primary" onClick={handleAdd(pick.c)}>
              <PlusIcon aria-hidden="true" />
              {m.goals_add_named({ goal: goalName(pick.c.name) })}
            </Button>
          </div>
        )}
        {full && <p className={styles.full}>{m.goals_full()}</p>}
        {top.length > 0 && (
          <ul className={styles.dests}>
            {top.map(({ c, p }) => (
              <GoalDestination
                key={c.name}
                goal={c}
                progress={p}
                marks={marks}
                shapes={shapes}
                disabled={full}
                onAdd={onAdd}
              />
            ))}
          </ul>
        )}
        {rest.length > 0 && (
          <details className={styles.more}>
            <summary>
              {m.goals_more()}{' '}
              <span className={styles.moreN}>· {rest.length}</span>
            </summary>
            {groups.map(({ kind, items }) => (
              <SuggestionGroup
                key={kind}
                kind={kind}
                items={items}
                disabled={full}
                onAdd={onAdd}
              />
            ))}
          </details>
        )}
      </details>
      <Button
        type="button"
        variant="secondary"
        className={styles.addOwn}
        aria-haspopup="dialog"
        disabled={full}
        onClick={onNewGoal}
      >
        <PlusIcon aria-hidden="true" />
        {m.goals_make_own()}
      </Button>
    </section>
  );
};

export default GoalSuggestions;
