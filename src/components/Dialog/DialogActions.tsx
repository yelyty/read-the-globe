import { type ReactNode } from 'react';

import * as styles from './Dialog.css';

type DialogActionsProps = { children: ReactNode };

/** the buttons row at the foot: the safe choice first, the action last */
const DialogActions = ({ children }: DialogActionsProps) => (
  <div className={styles.actions}>{children}</div>
);

export default DialogActions;
