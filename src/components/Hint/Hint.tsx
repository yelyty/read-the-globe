import type { ReactNode } from 'react';
import * as s from './Hint.css';

type HintProp = {
  children: string | ReactNode;
  id?: string;
  role?: string;
};

const Hint = ({ id, role, children }: HintProp) => {
  return (
    <p className={s.hint} id={id} role={role}>
      {children}
    </p>
  );
};

export default Hint;
