import type { CSSProperties } from 'react';

import { coverBinding } from './coverColors';
import * as styles from './BookCover.css';

type BookCoverProps = {
  title: string;
  author?: string;
  /** row: the Shelf and Home's lists; small: the map's country cards and the imagined-worlds list */
  size?: 'row' | 'small';
  className?: string;
};

/**
 * Shows the cloth-bound cover of a book. The title and the author always give the same cover.
 * The cover is decorative. The title beside it tells which book it is.
 * @param size - The size of the cover, for example in a row of the shelf.
 */
const BookCover = ({
  title,
  author = '',
  size = 'row',
  className,
}: BookCoverProps) => {
  const binding = coverBinding(title + author);
  const cloth: CSSProperties = { background: binding.color };

  return (
    <span
      className={
        className ? `${styles.cover[size]} ${className}` : styles.cover[size]
      }
      style={cloth}
      data-label={binding.label}
      data-bands={binding.bands}
      data-spine={binding.spine || undefined}
      aria-hidden="true"
    >
      <span className={styles.label[size]} />
    </span>
  );
};

export default BookCover;
