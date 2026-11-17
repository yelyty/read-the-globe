import { useId, type ReactNode } from 'react';

import * as styles from './AccountSection.css';

type AccountSectionProps = {
  title: string;
  danger?: boolean;
  children: ReactNode;
};

const AccountSection = ({ title, danger, children }: AccountSectionProps) => {
  const id = useId();

  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2
        id={id}
        className={
          danger
            ? `${styles.sectionTitle} ${styles.danger}`
            : styles.sectionTitle
        }
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

export default AccountSection;
