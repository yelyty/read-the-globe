import * as styles from './LoginDialog.css';
import { passwordStrength, STRENGTH_LABELS } from '../../../../auth/forms';

type PasswordStrengthProps = {
  /** the label's id: point the password input's aria-describedby at it */
  id: string;
  password: string;
};

// A bar and a word under a new password. The word is always in the DOM, so aria-describedby never points at nothing.
const PasswordStrength = ({ id, password }: PasswordStrengthProps) => {
  const strength = passwordStrength(password);

  return (
    <div className={styles.strength} hidden={!password}>
      <div className={styles.strengthBar} aria-hidden="true">
        <div
          className={styles.strengthFill[strength]}
          style={{ transform: `scaleX(${Math.max(0.04, strength / 4)})` }}
        />
      </div>
      <span id={id} className={styles.strengthLabel} aria-live="polite">
        {password ? STRENGTH_LABELS[strength]() : ''}
      </span>
    </div>
  );
};

export default PasswordStrength;
