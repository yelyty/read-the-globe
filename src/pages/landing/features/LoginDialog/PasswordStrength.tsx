import {
  MAX_STRENGTH,
  passwordStrength,
  STRENGTH_LABELS,
} from '../../../../auth/forms';
import * as styles from './LoginDialog.css';

// an empty bar still shows a sliver, so the track reads as a meter
const MIN_FILL = 0.04;

type PasswordStrengthProps = {
  /** the label's id: point the password input's aria-describedby at it */
  id: string;
  password: string;
};

/**
 * Shows a bar and a word under a new password, for its strength.
 * The word is always on the page, so aria-describedby always points to it.
 * @param id - The id of the word, for the aria-describedby of the password field.
 */
const PasswordStrength = ({ id, password }: PasswordStrengthProps) => {
  const strength = passwordStrength(password);

  return (
    <div className={styles.strength} hidden={!password}>
      <div className={styles.strengthBar} aria-hidden="true">
        <div
          className={styles.strengthFill[strength]}
          style={{
            transform: `scaleX(${Math.max(MIN_FILL, strength / MAX_STRENGTH)})`,
          }}
        />
      </div>
      <span id={id} className={styles.strengthLabel} aria-live="polite">
        {password ? STRENGTH_LABELS[strength]() : ''}
      </span>
    </div>
  );
};

export default PasswordStrength;
