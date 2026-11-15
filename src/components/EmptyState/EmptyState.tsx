import type { ReactNode } from 'react';

import * as styles from './EmptyState.css';

type EmptyStateProps = {
  /** a Sticker drawing above the words */
  art?: ReactNode;
  title?: string;
  text: ReactNode;
  /** buttons and links, stacked and centred */
  actions?: ReactNode;
  /** small print under the actions */
  note?: ReactNode;
  className?: string;
};

// what a page shows before it has anything in it: a drawing, a heading, a line, and the way to begin
const EmptyState = ({
  art,
  title,
  text,
  actions,
  note,
  className,
}: EmptyStateProps) => (
  <div
    className={
      className ? `${styles.emptyState} ${className}` : styles.emptyState
    }
  >
    {art}
    {title && <h2 className={styles.title}>{title}</h2>}
    <p className={styles.text}>{text}</p>
    {actions && <div className={styles.actions}>{actions}</div>}
    {note && <p className={styles.note}>{note}</p>}
  </div>
);

export default EmptyState;
