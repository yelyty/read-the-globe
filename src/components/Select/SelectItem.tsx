import { CheckIcon } from '@phosphor-icons/react';

import * as styles from './Select.css';

type SelectItemProps = {
  id: string;
  label: string;
  lang?: string;
  /** the value the select holds */
  selected: boolean;
  /** highlighted by the keyboard or the pointer */
  active: boolean;
  onClick: () => void;
  onPointerMove: () => void;
};

// one option in a Select's list; the listbox owns the keys, via aria-activedescendant
const SelectItem = ({
  id,
  label,
  lang,
  selected,
  active,
  onClick,
  onPointerMove,
}: SelectItemProps) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- the listbox owns the keys, via aria-activedescendant
  <li
    id={id}
    role="option"
    lang={lang}
    aria-selected={selected}
    data-active={active || undefined}
    className={styles.option}
    onClick={onClick}
    onPointerMove={onPointerMove}
  >
    {label}
    {selected && <CheckIcon className={styles.check} aria-hidden="true" />}
  </li>
);

export default SelectItem;
