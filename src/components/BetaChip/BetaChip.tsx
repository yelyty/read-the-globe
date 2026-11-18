import { m } from '../../paraglide/messages.js';
import { betaChip } from './BetaChip.css';

type BetaChipProps = {
  className?: string;
};

/**
 * Shows "Beta" beside the logo, while the app is still in beta.
 */
const BetaChip = ({ className }: BetaChipProps) => (
  <span className={className ? `${betaChip} ${className}` : betaChip}>
    {m.brand_beta()}
  </span>
);

export default BetaChip;
