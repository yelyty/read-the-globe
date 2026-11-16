import type { CSSProperties } from 'react';

import { coverBinding } from '../../utils/coverColors';
import * as styles from './BookCover.css';

type BookCoverProps = {
  title: string;
  author?: string;
  /** row: the Shelf and Home's lists; small: the map's country cards and the imagined-worlds list */
  size?: 'row' | 'small';
  className?: string;
};

// a book's cloth-bound cover: decorative, the title beside it says which book it is
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
