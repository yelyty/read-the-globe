import {
  BookmarkSimpleIcon,
  PushPinIcon,
  TrashIcon,
} from '@phosphor-icons/react';

import type { Goal, NextRead } from '../../../../types';
import type { Marks } from '../../../../utils/atlasMarks';
import { countryStamp, type Country } from '../../../../utils/countryStamps';
import { m } from '../../../../paraglide/messages.js';
import { Button } from '../../../../components/Button/Button';
import ButtonLink from '../../../../components/Button/ButtonLink';
import MarkDot from '../../../../components/MarkDot/MarkDot';
import { goalName } from '../../../goals/utils/catalogue';
import { goalHas } from '../../../goals/utils/goalProgress';
import * as styles from '../../ShelfPage.css';
import GoalTag from './GoalTag';

type NextItemProps = {
  item: NextRead;
  /** the world's countries, once loaded: its country's outline comes from here */
  countries: Map<string, Country> | undefined;
  names: Record<string, string>;
  marks: Marks;
  /** the reader's goals: it shows the ones this book would move along */
  goals: Goal[];
  onRemove: (item: NextRead) => void;
};

// a book to read next: the country it would mark (still pale), what it would count for, Log it and Remove
const NextItem = ({
  item,
  countries,
  names,
  marks,
  goals,
  onRemove,
}: NextItemProps) => {
  const code = item.countryCode;
  const country = code ? countries?.get(code) : undefined;
  const stamp = country ? countryStamp(country) : null;
  const place = code ? (names[code] ?? '') : '';
  // the country isn't on the atlas yet
  const fresh = Boolean(code && !marks[code]);
  const itemGoals = code ? goals.filter((goal) => goalHas(goal, code)) : [];

  const handleRemove = () => onRemove(item);

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
              <MarkDot kind={item.mark === 'set' ? 'set' : 'author'} />
              {item.mark === 'set'
                ? m.next_set_in({ country: place })
                : m.next_author_from({ country: place })}
            </span>
            {fresh && (
              <span className={styles.fresh}>
                {m.next_new_ground({ country: place })}
              </span>
            )}
            {itemGoals.map((goal) => (
              <GoalTag key={goal.id} name={goalName(goal.name)} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.nextActs}>
        <ButtonLink
          variant="link"
          underline
          to="."
          search={(prev) => ({ ...prev, log: true, next: item.id })}
        >
          <PushPinIcon aria-hidden="true" />
          {m.next_log_it()}
        </ButtonLink>
        <Button
          type="button"
          variant="link"
          underline
          aria-label={m.next_remove_label({ title: item.title })}
          onClick={handleRemove}
        >
          <TrashIcon aria-hidden="true" />
          {m.common_remove()}
        </Button>
      </div>
    </li>
  );
};

export default NextItem;
