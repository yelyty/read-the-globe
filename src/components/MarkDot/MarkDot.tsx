import { markDot } from './MarkDot.css';

export type MarkKind = keyof typeof markDot;

type MarkDotProps = {
  kind: MarkKind;
  className?: string;
};

/**
 * Shows the mark of a country as a dot beside its text. The dot is decorative, and the text tells which mark it is.
 * @param kind - The mark: a story set there, an author from there, or both.
 */
const MarkDot = ({ kind, className }: MarkDotProps) => (
  <i
    className={className ? `${markDot[kind]} ${className}` : markDot[kind]}
    aria-hidden="true"
  />
);

export default MarkDot;
