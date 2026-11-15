import * as styles from '../GoalsPage.css';
import { HEIGHT, WIDTH } from '../utils/plate';

// a shelf holds this many spines; a longer goal fills them by share
const MAX_SPINES = 20;
const SPINE_GAP = 3;
const MAX_SPINE_WIDTH = 14;
// room left on both sides of the row, together
const SIDE_ROOM = 24;
// the plank's height above the plate's bottom, and its inset from the sides
const PLANK_RISE = 22;
const PLANK_INSET = 10;
// spines vary in height: the shortest, plus a repeatable step folded into a spread
const MIN_SPINE_HEIGHT = 44;
const SPINE_HEIGHT_STEP = 37;
const SPINE_HEIGHT_SPREAD = 23;

const GoalShelf = ({ done, total }: { done: number; total: number }) => {
  const count = Math.min(total, MAX_SPINES);

  const filled =
    total <= MAX_SPINES
      ? Math.min(done, count)
      : Math.round(Math.min(1, done / total) * count);

  const sw = Math.min(
    MAX_SPINE_WIDTH,
    (WIDTH - SIDE_ROOM - SPINE_GAP * (count - 1)) / count
  );

  const x0 = (WIDTH - (sw * count + SPINE_GAP * (count - 1))) / 2;
  const base = HEIGHT - PLANK_RISE;

  return (
    <svg
      className={styles.plate}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: count }, (_unused, i) => {
        const height =
          MIN_SPINE_HEIGHT + ((i * SPINE_HEIGHT_STEP) % SPINE_HEIGHT_SPREAD);

        return (
          <rect
            key={i}
            className={i < filled ? styles.spineIn : styles.spine}
            x={x0 + i * (sw + SPINE_GAP)}
            y={base - height}
            width={sw}
            height={height}
            rx="1.5"
          />
        );
      })}
      <line
        className={styles.plank}
        x1={PLANK_INSET}
        x2={WIDTH - PLANK_INSET}
        y1={base + 1}
        y2={base + 1}
      />
    </svg>
  );
};

export default GoalShelf;
