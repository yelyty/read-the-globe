import type { BookEntry } from '../../../../types';
import { readYear } from '../../../../utils/readDate';
import BookRow from '../../../../components/BookRow/BookRow';
import YearHead from './YearHead';

type ShelfEntryProps = {
  book: BookEntry;
  /** the book above it in the list: a new year starts when the years differ */
  previous: BookEntry | undefined;
  /** the list is newest first, so it's grouped under year headings */
  byYear: boolean;
  /** nothing narrows the list, so years can fold */
  foldable: boolean;
  /** the folded years */
  folded: Set<string>;
  /** each year's line: books and countries */
  notes: Record<string, string>;
  names: Record<string, string>;
  onYearToggle: (year: string) => void;
};

/**
 * Shows a book on the shelf. The first book of a year comes under the heading of the year.
 * The book is hidden while its year is folded.
 * @param previous - The book before it in the list, to know if it is the first of its year.
 */
const ShelfEntry = ({
  book,
  previous,
  byYear,
  foldable,
  folded,
  notes,
  names,
  onYearToggle,
}: ShelfEntryProps) => {
  const year = byYear ? readYear(book) : '';
  const isFolded = !!year && foldable && folded.has(year);
  const firstOfYear = !previous || readYear(previous) !== year;

  const handleToggle = () => onYearToggle(year);

  return (
    <>
      {year && firstOfYear && (
        <YearHead
          year={year}
          foldable={foldable}
          folded={isFolded}
          note={notes[year]}
          onToggle={handleToggle}
        />
      )}
      {!isFolded && <BookRow book={book} names={names} />}
    </>
  );
};

export default ShelfEntry;
