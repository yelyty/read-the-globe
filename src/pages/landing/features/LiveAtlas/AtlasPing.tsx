import * as styles from './LiveAtlas.css';

const PING_RADIUS = 14;

// a ring where a book just pinned itself
const AtlasPing = ({ x, y }: { x: number; y: number }) => (
  <circle className={styles.ping} cx={x} cy={y} r={PING_RADIUS} />
);

export default AtlasPing;
