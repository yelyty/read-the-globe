import { hatchAuthor, hatchSet } from './HatchPattern.css';

type HatchPatternProps = {
  /** what a shape's fill points at: fill: url(#id) */
  id: string;
  /** one olive and one rust stripe, in the SVG's own units */
  size: number;
};

/**
 * Shows the stripes of a country with both marks: olive and rust stripes at 45°. Put it inside the defs of an SVG.
 * @param size - The width of one pair of stripes.
 */
const HatchPattern = ({ id, size }: HatchPatternProps) => (
  <pattern
    id={id}
    patternUnits="userSpaceOnUse"
    width={size}
    height={size}
    patternTransform="rotate(45)"
  >
    <rect width={size} height={size} className={hatchSet} />
    <rect width={size / 2} height={size} className={hatchAuthor} />
  </pattern>
);

export default HatchPattern;
