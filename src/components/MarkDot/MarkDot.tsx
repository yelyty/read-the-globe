import { markDot } from './MarkDot.css';

export type MarkKind = keyof typeof markDot;

type MarkDotProps = {
  kind: MarkKind;
  className?: string;
};

// a country's mark as a dot beside its words; decorative, the words say which mark it is
const MarkDot = ({ kind, className }: MarkDotProps) => (
  <i
    className={className ? `${markDot[kind]} ${className}` : markDot[kind]}
    aria-hidden="true"
  />
);

export default MarkDot;
