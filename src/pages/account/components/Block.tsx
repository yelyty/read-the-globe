import { useId, type ReactNode } from 'react';

import * as styles from './Block.css';

type BlockProps = {
  title: string;
  danger?: boolean;
  children: ReactNode;
};

const Block = ({ title, danger, children }: BlockProps) => {
  const id = useId();

  return (
    <section className={styles.block} aria-labelledby={id}>
      <h2
        id={id}
        className={
          danger ? `${styles.blockTitle} ${styles.danger}` : styles.blockTitle
        }
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Block;
