import { Link } from '@tanstack/react-router';
import {
  BookmarkSimpleIcon,
  PushPinIcon,
  TrashIcon,
} from '@phosphor-icons/react';

import type { Goal, NextRead } from '../../../types';
import { m } from '../../../paraglide/messages.js';
import { goalName } from '../../goals/goals';
import * as styles from '../ShelfPage.css';

type NextItemProps = {
  item: NextRead;
  /** its country's outline, once the world has loaded */
  stamp: { d: string; viewBox: string } | null;
  /** its country's name, or "" */
  place: string;
  /** the country isn't on the atlas yet */
  fresh: boolean;
  /** the goals this book would move along */
  goals: Goal[];
  onRemove: (item: NextRead) => void;
};

// a book to read next: the country it would mark (still pale), what it would count for, Log it and Remove
const NextItem = ({
  item,
  stamp,
  place,
  fresh,
  goals,
  onRemove,
}: NextItemProps) => {
  const handleRemove = () => onRemove(item);

  const renderGoal = (goal: Goal) => (
    <span key={goal.id} className={styles.nextGoal}>
      {goalName(goal.name)}
    </span>
  );

  return (
    <li id={`next-${item.id}`} tabIndex={-1} className={styles.nextItem}>
      {/* the country it would mark, still pale: it isn't on the atlas until it's read */}
      <span className={styles.nextStamp} aria-hidden="true">
        {stamp ? (
          <svg viewBox={stamp.viewBox} focusable="false">
            <path
              className={styles.nextShape}
              d={stamp.d}
              data-mark={item.mark}
            />
          </svg>
        ) : (
          <BookmarkSimpleIcon className={styles.nextMark} />
        )}
      </span>
      <div className={styles.nextBody}>
        <span className={styles.nextTitle}>{item.title}</span>
        {item.author && (
          <span className={styles.nextAuthor}>{item.author}</span>
        )}
        {item.countryCode && (
          <div className={styles.nextMeta}>
            <span>
              <i
                className={
                  item.mark === 'set' ? styles.dotSet : styles.dotAuthor
                }
                aria-hidden="true"
              />
              {item.mark === 'set'
                ? m.next_set_in({ country: place })
                : m.next_author_from({ country: place })}
            </span>
            {fresh && (
              <span className={styles.fresh}>
                {m.next_new_ground({ country: place })}
              </span>
            )}
            {goals.map(renderGoal)}
          </div>
        )}
      </div>
      <div className={styles.nextActs}>
        <Link
          className={styles.linkBtn}
          to="."
          search={(prev) => ({ ...prev, log: true, next: item.id })}
        >
          <PushPinIcon aria-hidden="true" />
          {m.next_log_it()}
        </Link>
        <button
          type="button"
          className={styles.linkBtn}
          aria-label={m.next_remove_label({ title: item.title })}
          onClick={handleRemove}
        >
          <TrashIcon aria-hidden="true" />
          {m.common_remove()}
        </button>
      </div>
    </li>
  );
};

export default NextItem;
