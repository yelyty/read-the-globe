import { XIcon } from '@phosphor-icons/react';

import type { World } from '../../../../types';
import type { WorldRow } from '../../../../utils/worlds';
import { m } from '../../../../paraglide/messages.js';
import MarkDot from '../../../../components/MarkDot/MarkDot';
import * as styles from '../../HomePage.css';

type WorldItemProps = {
  world: WorldRow;
  onOpen: (world: WorldRow) => void;
  onRemove: (world: World) => void;
};

// an imagined world under the map: it opens its books; a saved world with none yet can be removed
const WorldItem = ({ world, onOpen, onRemove }: WorldItemProps) => {
  const handleOpen = () => onOpen(world);
  const handleRemove = () => world.saved && onRemove(world.saved);

  return (
    <li className={styles.worldRow}>
      <button
        type="button"
        className={styles.worldOpen}
        aria-haspopup="dialog"
        onClick={handleOpen}
      >
        <MarkDot kind="imagined" />
        <span
          className={styles.worldName}
          data-saved={!world.books.length || undefined}
        >
          {world.name}
        </span>
        <span className={styles.beyondN}>
          {world.books.length
            ? m.count_book({ count: world.books.length })
            : m.world_no_books_short()}
        </span>
      </button>
      {!world.books.length && world.saved && (
        <button
          type="button"
          className={styles.beyondRm}
          aria-label={m.world_remove({ name: world.name })}
          onClick={handleRemove}
        >
          <XIcon aria-hidden="true" />
        </button>
      )}
    </li>
  );
};

export default WorldItem;
