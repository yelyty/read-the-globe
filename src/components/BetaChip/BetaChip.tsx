import { m } from '../../paraglide/messages.js';
import { betaChip } from './BetaChip.css';

type BetaChipProps = {
  className?: string;
};

// "Beta" beside the logo, while the app is still being shaped
const BetaChip = ({ className }: BetaChipProps) => (
  <span className={className ? `${betaChip} ${className}` : betaChip}>
    {m.brand_beta()}
  </span>
);

export default BetaChip;
