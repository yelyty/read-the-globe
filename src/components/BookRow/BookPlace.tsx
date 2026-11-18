import type { Place } from '../../types';
import * as styles from './BookRow.css';

type BookPlaceProps = {
  place: Place;
  names: Record<string, string>;
  /** the first of the list: no comma before it */
  first: boolean;
};

/**
 * Shows one place of a book: its name with its country after it, or only the country.
 * @param first - If false, a comma comes before the place.
 */
const BookPlace = ({ place, names, first }: BookPlaceProps) => {
  const country = place.countryCode ? names[place.countryCode] : undefined;

  return (
    <>
      {!first && ', '}
      {place.name || country}
      {place.name && country && (
        <em className={styles.markCountry}> · {country}</em>
      )}
    </>
  );
};

export default BookPlace;
