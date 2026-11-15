import { markOf, type Mark, type MarkWhich } from '../../utils/atlasMarks';
import * as styles from './GoalsPage.css';

const SHAPE: Record<MarkWhich, string> = {
  set: styles.shapeSet,
  author: styles.shapeAuthor,
  both: styles.shapeMarked,
};

type PlateCountryProps = {
  /** its outline, already projected onto the plate */
  d: string;
  mark?: Mark;
  /** the id of the plate's hatch pattern, for a country with both marks */
  hatch: string;
};

// one country on a goal's plate: to do, or coloured by its marks
const PlateCountry = ({ d, mark, hatch }: PlateCountryProps) => {
  const which = mark && markOf(mark);
  const both = which === 'both';
  const className = which ? SHAPE[which] : styles.shapeTodo;

  return (
    <path
      d={d}
      className={className}
      style={both ? { fill: `url(#${hatch})` } : undefined}
    />
  );
};

export default PlateCountry;
