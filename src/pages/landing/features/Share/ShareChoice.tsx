import * as styles from './Share.css';
import type { Kind } from './Share';

type ShareChoiceProps = {
  variant: Kind;
  checked: boolean;
  onChoose: (variant: Kind) => void;
};

/**
 * Shows one kind of postcard as a radio button.
 */
const ShareChoice = ({ variant, checked, onChoose }: ShareChoiceProps) => {
  const handleChange = () => onChoose(variant);

  return (
    <label className={styles.variant}>
      <input
        type="radio"
        name="pcv"
        value={variant.id}
        aria-controls="pc-stack"
        checked={checked}
        onChange={handleChange}
      />
      <b>{variant.name()}</b> <span>{variant.detail()}</span>
    </label>
  );
};

export default ShareChoice;
