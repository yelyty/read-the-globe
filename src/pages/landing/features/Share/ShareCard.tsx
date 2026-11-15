import * as styles from './Share.css';
import type { Kind } from './Share';

// the card images are square
const CARD_SIZE = 1080;

type ShareCardProps = {
  variant: Kind;
  /** the chosen kind's card: the one on top */
  shown: boolean;
  /** loads only when it's needed */
  lazy: boolean;
};

// the app's day card for one kind of postcard
const ShareCard = ({ variant, shown, lazy }: ShareCardProps) => (
  <img
    className={shown ? `${styles.card} ${styles.on}` : styles.card}
    src={`/landing/postcard-${variant.id}-day.webp`}
    width={CARD_SIZE}
    height={CARD_SIZE}
    alt={variant.alt()}
    loading={lazy ? 'lazy' : undefined}
    decoding="async"
  />
);

export default ShareCard;
