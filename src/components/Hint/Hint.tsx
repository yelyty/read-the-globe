import type { ReactNode } from 'react';

import * as styles from './Hint.css';

type HintProps = {
  children: string | ReactNode;
  id?: string;
  role?: string;
};

/**
 * Shows a short hint under a field.
 */
const Hint = ({ id, role, children }: HintProps) => {
  return (
    <p className={styles.hint} id={id} role={role}>
      {children}
    </p>
  );
};

export default Hint;
