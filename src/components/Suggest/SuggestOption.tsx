import type { ReactNode } from 'react';

import * as styles from './Suggest.css';

type SuggestOptionProps = {
  id: string;
  /** its place in the menu: the menu's click handler reads it back */
  index: number;
  /** the one the arrow keys are on */
  active: boolean;
  children: ReactNode;
};

// one suggestion in the menu; the menu itself handles the click
const SuggestOption = ({ id, index, active, children }: SuggestOptionProps) => (
  <li
    id={id}
    data-i={index}
    className={styles.option}
    role="option"
    aria-selected={active}
  >
    {children}
  </li>
);

export default SuggestOption;
