import { useId, type ReactNode } from 'react';

import * as s from './Block.css';

type BlockProps = {
  title: string;
  danger?: boolean;
  children: ReactNode;
};

const Block = ({ title, danger, children }: BlockProps) => {
  const id = useId();
  return (
    <section className={s.block} aria-labelledby={id}>
      <h2
        id={id}
        className={danger ? `${s.blockTitle} ${s.danger}` : s.blockTitle}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Block;
