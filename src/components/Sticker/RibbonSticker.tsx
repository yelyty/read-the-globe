import Sticker from './Sticker';
import * as styles from './Sticker.css';

// a closed book with a ribbon marking where you'll start, its dotted road running to a pin not yet placed
const RibbonSticker = () => (
  <Sticker>
    <path
      className={styles.ribbonRoad}
      d="M50 74 C 64 80, 76 74, 84 64 C 90 56, 94 50, 98 44"
    />
    <rect
      className={styles.ribbonBook}
      x="14"
      y="30"
      width="44"
      height="50"
      rx="3"
    />
    <path className={styles.ribbonSpine} d="M22 30 V 80" />
    <path
      className={styles.ribbonRibbon}
      d="M44 26 V 92 L 40 88 L 36 92 V 26 Z"
    />
    <path
      className={styles.ribbonPin}
      d="M101 18c-6 0-10.5 4.6-10.5 10.4 0 7.6 10.5 17.6 10.5 17.6s10.5-10 10.5-17.6C111.5 22.6 107 18 101 18Z"
    />
    <circle className={styles.ribbonPinEye} cx="101" cy="28.6" r="3.4" />
  </Sticker>
);

export default RibbonSticker;
