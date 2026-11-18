import type { BookEntry } from '../../../../types';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import * as styles from '../../GoalsPage.css';

type BookPickProps = {
  book: BookEntry;
  checked: boolean;
  onToggle: (id: number) => void;
};

/**
 * Shows a book with a checkbox, to count it for a goal.
 */
const BookPick = ({ book, checked, onToggle }: BookPickProps) => {
  const handleChange = () => onToggle(book.id);

  return (
    <li>
      <label>
        <Checkbox
          className={styles.pickBox}
          checked={checked}
          onChange={handleChange}
        />
        <span className={styles.pickTitle}>{book.title}</span>
        <span className={styles.pickAuthor}>{book.author?.name}</span>
      </label>
    </li>
  );
};

export default BookPick;
