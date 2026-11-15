import type { BookEntry } from '../../types';
import * as styles from './GoalsPage.css';

type BookPickProps = {
  book: BookEntry;
  checked: boolean;
  onToggle: (id: string) => void;
};

// a book to tick toward a goal
const BookPick = ({ book, checked, onToggle }: BookPickProps) => {
  const handleChange = () => onToggle(book.id);

  return (
    <li>
      <label>
        <input type="checkbox" checked={checked} onChange={handleChange} />
        <span className={styles.pickTitle}>{book.title}</span>
        <span className={styles.pickAuthor}>{book.author?.name}</span>
      </label>
    </li>
  );
};

export default BookPick;
