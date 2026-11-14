import type { Mark } from '../../utils/atlasMarks';
import * as styles from './GoalsPage.css';

type PlateCountryProps = {
  /** its outline, already projected onto the plate */
  d: string;
  mark?: Mark;
  /** the id of the plate's hatch pattern, for a country with both marks */
  hatch: string;
};

// one country on a goal's plate: to do, or coloured by its marks
const PlateCountry = ({ d, mark, hatch }: PlateCountryProps) => {
  const both = mark && mark.set.length > 0 && mark.author.length > 0;

  const className = !mark
    ? styles.shapeTodo
    : both
      ? styles.shapeMarked
      : mark.set.length
        ? styles.shapeSet
        : styles.shapeAuthor;

  return (
    <path
      d={d}
      className={className}
      style={both ? { fill: `url(#${hatch})` } : undefined}
    />
  );
};

export default PlateCountry;
